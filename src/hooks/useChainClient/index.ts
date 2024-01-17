import { ChainId } from '@hooks/useChainId/Chains';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { kujiraQueryClient } from 'kujira.js';
import { Coin } from '@models/index';
import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { getChainEndpoint, getOsmosisRouterUrl } from '@helpers/chains';
import { osmosis } from 'osmojs';
import { useQuery } from '@tanstack/react-query';
import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { DenomInfo, fromPartial } from '@utils/DenomInfo';
import { ARCHWAY_CHAINS, KUJIRA_CHAINS, OSMOSIS_CHAINS } from 'src/constants';
import { reduce, toPairs } from 'rambda';
import { Asset } from '@chain-registry/types';
import { OsmosisMainnetDenoms, OsmosisTestnetDenoms } from '@models/Denom';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { fromAtomic } from '@utils/getDenomInfo';
import Long from 'long';
import { DENOMS } from '@utils/denoms';

export type ChainClient = {
  fetchDenoms: () => Promise<{ [x: string]: DenomInfo }>;
  fetchTokenBalance: (address: string, tokenId: string) => Promise<Coin>;
  fetchBalances: (address: string) => Promise<Coin[]>;
  fetchValidators: () => Promise<{ validators: Validator[] }>;
  fetchRoute: (
    initialDenom: DenomInfo,
    targetDenom: DenomInfo,
    swapAmount: number,
  ) => Promise<{ route: string | undefined; feeRate: number }>;
};

const fetchDenomsKujira = (chainId: ChainId): Promise<{ [x: string]: DenomInfo }> =>
  Promise.resolve(
    reduce(
      (acc: { [x: string]: DenomInfo }, [id, info]: [string, Partial<DenomInfo>]) => ({
        ...acc,
        [id]: fromPartial({ chain: chainId, id, ...info }),
      }),
      {},
      toPairs(DENOMS[chainId]),
    ),
  );

const fetchDenomsOsmosis = async (chainId: ChainId): Promise<{ [x: string]: DenomInfo }> => {
  const baseUrl = 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main';
  const response = await fetch(`${baseUrl}/${chainId}/${chainId}.assetlist.json`);
  const { assets } = await response.json();

  const allOverrides = DENOMS[chainId];

  return reduce(
    (acc: { [x: string]: DenomInfo }, asset: Asset) => {
      const findDenomUnits = asset.denom_units.find((du) => du.denom === asset.display);
      const significantFigures = findDenomUnits?.exponent || 6;

      const denom = asset.base as OsmosisMainnetDenoms | OsmosisTestnetDenoms;
      const overrides = (denom in allOverrides && allOverrides[denom]) || {};

      return {
        ...acc,
        [asset.base]: fromPartial({
          chain: chainId,
          id: asset.base,
          name: overrides.name || asset.symbol,
          icon: overrides.icon || asset.logo_URIs?.svg || asset.logo_URIs?.png,
          stakeable: overrides.stakeable || false,
          stakeableAndSupported: overrides.stakeableAndSupported || false,
          stable: overrides.stable || false,
          coingeckoId: overrides.coingeckoId || asset.coingecko_id || '',
          enabledInDcaPlus: overrides.enabledInDcaPlus || false,
          significantFigures,
        }),
      };
    },
    {},
    assets,
  );
};

const fetchDenomsArchway = async (chainId: ChainId) => {
  const url =
    chainId === 'constantine-3'
      ? 'https://const.astrovault.io/asset?env=public'
      : 'https://arch.astrovault.io/asset?env=public';

  const { data: assets } = await (await fetch(url)).json();

  return reduce(
    (acc: { [x: string]: DenomInfo }, asset: any) => ({
      ...acc,
      [asset.id]: fromPartial({
        chain: chainId,
        id: asset.id,
        name: asset.label,
        significantFigures: asset.decimals,
        ...((asset.id in DENOMS[chainId] && DENOMS[chainId][asset.id]) || {}),
      }),
    }),
    {},
    assets,
  );
};

const kujiraChainClient = async (chainId: ChainId, cosmWasmClient: CosmWasmClient): Promise<ChainClient> => {
  const client = await Tendermint34Client.create(
    new HttpBatchClient(getChainEndpoint(chainId), {
      dispatchInterval: 100,
      batchSizeLimit: 200,
    }),
  );

  const queryClient = kujiraQueryClient({ client: client as any });

  return {
    fetchDenoms: () => fetchDenomsKujira(chainId),
    fetchTokenBalance: (address: string, tokenId: string) => cosmWasmClient!.getBalance(address, tokenId),
    fetchBalances: (address: string) =>
      queryClient.bank.allBalances(address, {
        key: Buffer.from(''),
        offset: Long.fromInt(0),
        limit: Long.fromInt(1000),
        countTotal: false,
        reverse: false,
      }),
    fetchValidators: async () => {
      const response = await queryClient.staking.validators('BOND_STATUS_BONDED');
      return response as unknown as { validators: Validator[] };
    },
    fetchRoute: async (_: DenomInfo, __: DenomInfo, ___: number) => ({ route: undefined, feeRate: 0.0075 }),
  };
};

const osmosisChainClient = async (chainId: ChainId, cosmWasmClient: CosmWasmClient): Promise<ChainClient> => {
  const queryClient = await osmosis.ClientFactory.createRPCQueryClient({
    rpcEndpoint: getChainEndpoint(chainId),
  });

  return {
    fetchDenoms: () => fetchDenomsOsmosis(chainId),
    fetchTokenBalance: (address: string, tokenId: string) => cosmWasmClient!.getBalance(address, tokenId),
    fetchBalances: async (address: string) => {
      const { balances } = await queryClient.cosmos.bank.v1beta1.allBalances({
        address,
        pagination: {
          key: Buffer.from(''),
          offset: Long.fromInt(0),
          limit: Long.fromInt(1000),
          countTotal: false,
          reverse: false,
        },
      });
      return balances;
    },
    fetchValidators: async () => {
      const response = await queryClient.cosmos.staking.v1beta1.validators({
        status: 'BOND_STATUS_BONDED',
      });
      return response as unknown as { validators: Validator[] };
    },
    fetchRoute: async (initialDenom: DenomInfo, targetDenom: DenomInfo, swapAmount: number) => {
      try {
        const response = await (
          await fetch(
            `${getOsmosisRouterUrl(chainId!)}/router/single-quote?${new URLSearchParams({
              tokenIn: `${swapAmount}${initialDenom.id}`,
              tokenOutDenom: targetDenom!.id,
            })}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        ).json();

        return {
          route: Buffer.from(
            JSON.stringify(
              response.route.flatMap((r: any) =>
                r.pools.map((pool: any) => ({
                  pool_id: `${pool.id}`,
                  token_out_denom: pool.token_out_denom,
                })),
              ),
            ),
          ).toString('base64'),
          feeRate: 0.003,
        };
      } catch (error: any) {
        if (`${error}`.includes('amount of')) {
          throw new Error(
            `Swap amount of ${fromAtomic(initialDenom, Number(swapAmount))} ${
              initialDenom.name
            } too high to find dynamic osmosis route.`,
          );
        }

        throw new Error('Error fetching route from Osmosis');
      }
    },
  };
};

const archwayChainClient = async (chainId: ChainId, cosmWasmClient: CosmWasmClient): Promise<ChainClient> => {
  const queryClient = await osmosis.ClientFactory.createRPCQueryClient({
    rpcEndpoint: getChainEndpoint(chainId),
  });

  return {
    fetchDenoms: () => fetchDenomsArchway(chainId),
    fetchTokenBalance: (address: string, tokenId: string) => cosmWasmClient!.getBalance(address, tokenId),
    fetchBalances: async (address: string) => {
      const { balances } = await queryClient.cosmos.bank.v1beta1.allBalances({
        address,
        pagination: {
          key: Buffer.from(''),
          offset: Long.fromInt(0),
          limit: Long.fromInt(1000),
          countTotal: false,
          reverse: false,
        },
      });
      return balances;
    },
    fetchValidators: async () => {
      const response = await queryClient.cosmos.staking.v1beta1.validators({
        status: 'BOND_STATUS_BONDED',
      });
      return response as unknown as { validators: Validator[] };
    },
    fetchRoute: async (_: DenomInfo, __: DenomInfo, ___: number) => ({ route: undefined, feeRate: 0.0075 }), // TODO: understand fees
  };
};

export function useChainClient(chainId: ChainId) {
  const { cosmWasmClient } = useCosmWasmClient(chainId);

  const { data: chainClient } = useQuery<ChainClient>(
    ['chainClient', chainId],
    () => {
      if (KUJIRA_CHAINS.includes(chainId)) {
        return kujiraChainClient(chainId, cosmWasmClient!);
      }

      if (OSMOSIS_CHAINS.includes(chainId)) {
        return osmosisChainClient(chainId, cosmWasmClient!);
      }

      if (ARCHWAY_CHAINS.includes(chainId)) {
        return archwayChainClient(chainId, cosmWasmClient!);
      }

      throw new Error(`Unsupported chain ${chainId}`);
    },
    {
      enabled: !!chainId && !!cosmWasmClient,
      staleTime: 1000 * 60 * 10,
      meta: {
        errorMessage: 'Error fetching chain client',
      },
    },
  );

  return chainClient;
}
