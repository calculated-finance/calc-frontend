import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Coin } from '@cosmjs/proto-signing';
import { getChainEndpoint } from '@helpers/chains';
import { ChainId } from '@models/ChainId';
import { InitialDenomInfo, ResultingDenomInfo, fromPartial } from '@utils/DenomInfo';
import { Pair } from '@models/Pair';
import { reduce, filter, map, toPairs, flatten } from 'rambda';
import { osmosis } from 'osmojs';
import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { DENOMS } from 'src/fixtures/denoms';
import constantine3Data from 'src/assetLists/constantine-3';
import archway1Data from 'src/assetLists/archway-1';
import { ROUTES } from 'src/fixtures/routes';
import { ChainClient, fetchBalances } from './helpers';

const fetchDenoms = async (chainId: ChainId): Promise<{ [x: string]: InitialDenomInfo }> => {
  const isTestnet = chainId === 'constantine-3';
  const url = isTestnet
    ? process.env.NEXT_PUBLIC_ARCHWAY_TESTNET_API_URL!
    : process.env.NEXT_PUBLIC_ARCHWAY_MAINNET_API_URL!;
  const fallbackData = isTestnet ? constantine3Data : archway1Data;

  const fetchDenomsWithFallback = async () => {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'dev') {
      return fallbackData;
    }
    try {
      const response = await fetch(url);
      return response.ok ? await response.json() : fallbackData;
    } catch (error) {
      return fallbackData;
    }
  };

  const { data: assets } = await fetchDenomsWithFallback();

  return reduce(
    (acc: { [x: string]: InitialDenomInfo }, asset: any) => ({
      ...acc,
      ...{
        [asset.id]: fromPartial({
          chain: chainId,
          id: asset.id,
          name: asset.label,
          significantFigures: asset.decimals,
          isCw20: !asset.isNative,
          coingeckoId: asset.geckoIDPriceSource,
          ...DENOMS[chainId][asset.id],
        }),
      },
    }),
    {},
    filter((asset: any) => asset.id in DENOMS[chainId], assets),
  );
};

export const archwayChainClient = async (chainId: ChainId, cosmWasmClient: CosmWasmClient): Promise<ChainClient> => {
  const queryClient = await osmosis.ClientFactory.createRPCQueryClient({
    rpcEndpoint: getChainEndpoint(chainId),
  });

  return {
    fetchDenoms: () => fetchDenoms(chainId),
    fetchPairs: async (
      _chainId: ChainId,
      _contractAddress: string,
      _client: CosmWasmClient,
      _startAfter?: string,
      _allPairs?: Pair[],
    ) =>
      flatten(
        map(
          ([from, destinations]: [string, { [x: string]: any[] }]) =>
            map(([to, _]: [string, any]) => ({ denoms: [from, to] }), toPairs(destinations)),
          toPairs(ROUTES[chainId]),
        ),
      ),
    fetchTokenBalance: async (address: string, denom: InitialDenomInfo) =>
      (await fetchBalances(queryClient, cosmWasmClient, address, await fetchDenoms(chainId))).find(
        (b: Coin) => b.denom === denom.id,
      ) ?? {
        denom: denom.id,
        amount: '0',
      },
    fetchBalances: async (address: string) =>
      fetchBalances(queryClient, cosmWasmClient, address, await fetchDenoms(chainId)),
    fetchValidators: async () =>
      (await queryClient.cosmos.staking.v1beta1.validators({
        status: 'BOND_STATUS_BONDED',
      })) as unknown as { validators: Validator[] },

    fetchRoute: async (initialDenom: InitialDenomInfo, targetDenom: ResultingDenomInfo, ___: bigint) => {
      const route = ROUTES[chainId][initialDenom.id][targetDenom.id];
      return {
        route: route ? Buffer.from(JSON.stringify(route)).toString('base64') : undefined,
        feeRate: 0.0075, // TODO: figure this out
        routeError: route
          ? undefined
          : `No route found between ${initialDenom.name} and ${targetDenom.name} on Astrovault`,
      };
    },
  };
};
