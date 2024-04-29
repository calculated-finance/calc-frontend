import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainEndpoint, getNeutronApiUrl } from '@helpers/chains';
import { ChainId } from '@models/ChainId';
import { DenomInfo, InitialDenomInfo, ResultingDenomInfo, fromPartial } from '@utils/DenomInfo';
import { values, reduce, forEach, join, map, filter, sort } from 'rambda';
import { osmosis } from 'osmojs';
import { Pair } from '@models/Pair';
import { DENOMS } from 'src/fixtures/denoms';
import { ChainClient, fetchBalance, fetchBalances } from './helpers';

const fetchDenoms = async (chainId: ChainId) => {
  const response = await fetch(
    `${getNeutronApiUrl(chainId)}/api/trpc/tokens.getAll?input={"json":{"chainId":"${chainId}"}}`,
  );

  const {
    result: {
      data: { json: assets },
    },
  } = await response.json();

  console.log(filter((asset: any) => asset.symbol === 'NEWT', values(assets)));

  return reduce(
    (acc: { [x: string]: InitialDenomInfo }, asset: any) => ({
      ...acc,
      ...{
        [asset.token]: fromPartial({
          chain: chainId,
          id: asset.token,
          name: asset.symbol,
          significantFigures: asset.decimals,
          isCw20: (asset.token as string)?.startsWith('neutron1') ?? false,
          coingeckoId: asset.coingeckoId,
          ...DENOMS[chainId][asset.token],
        }),
      },
    }),
    {},
    filter((asset: any) => asset.token in DENOMS[chainId], values(assets)),
  );
};

export const neutronChainClient = async (chainId: ChainId, _cosmWasmClient: CosmWasmClient): Promise<ChainClient> => {
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
    ) => {
      const denoms = values(await fetchDenoms(chainId));
      return values(
        reduce(
          (acc: { [x: string]: Pair }, denom: InitialDenomInfo) => {
            const pairs: { [x: string]: Pair } = {};
            forEach((otherDenom: InitialDenomInfo) => {
              if (denom.id !== otherDenom.id) {
                const key = join(
                  '-',
                  sort((a, b) => (a > b ? -1 : 1), [denom.id, otherDenom.id]),
                );
                pairs[key] = {
                  denoms: [denom.id, otherDenom.id],
                };
              }
            }, denoms);
            return { ...acc, ...pairs };
          },
          {},
          denoms,
        ),
      );
    },
    fetchTokenBalance: (address: string, denom: InitialDenomInfo) =>
      fetchBalance(queryClient, _cosmWasmClient, address, denom),
    fetchBalances: async (address: string) =>
      fetchBalances(queryClient, _cosmWasmClient, address, await fetchDenoms(chainId)),
    fetchValidators: () => Promise.resolve({ validators: [] }),
    fetchRoute: async (initialDenom: InitialDenomInfo, targetDenom: ResultingDenomInfo, swapAmount: bigint) => {
      const response = await fetch(
        `${getNeutronApiUrl(chainId)}/api/routes?${new URLSearchParams({
          start: initialDenom.id,
          end: targetDenom.id,
          amount: swapAmount.toString(),
          chainId,
          limit: '1',
        })}`,
      );

      if (!response.ok) {
        return {
          route: undefined,
          feeRate: 0.0,
          routeError: `Unable to fetch a route from ${initialDenom.name} to ${targetDenom.name} on Astroport`,
        };
      }

      const { swaps } = (await response.json())[0];

      const route = Buffer.from(
        JSON.stringify(
          map(
            (swap: any) => ({
              astro_swap: {
                offer_asset_info: swap.from.startsWith('neutron')
                  ? { token: { contract_addr: swap.from } }
                  : { native_token: { denom: swap.from } },
                ask_asset_info: swap.to.startsWith('neutron')
                  ? { token: { contract_addr: swap.to } }
                  : { native_token: { denom: swap.to } },
              },
            }),
            swaps,
          ),
        ),
      ).toString('base64');

      return {
        route,
        feeRate: 0.003 * swaps.length,
        routeError: undefined,
      };
    },
  };
};
