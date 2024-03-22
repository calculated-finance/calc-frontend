import { ChainId } from '@models/ChainId';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { kujiraQueryClient } from 'kujira.js';
import { Coin } from '@models/index';
import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { getChainEndpoint, getNeutronApiUrl, getOsmosisRouterUrl, getPairsFetchLimit } from '@helpers/chains';
import { osmosis } from 'osmojs';
import { useQuery } from '@tanstack/react-query';
import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { DenomInfo, fromPartial } from '@utils/DenomInfo';
import { ARCHWAY_CHAINS, KUJIRA_CHAINS, NEUTRON_CHAINS, OSMOSIS_CHAINS } from 'src/constants';
import { forEach, join, map, reduce, sort, toPairs, values } from 'rambda';
import { Asset } from '@chain-registry/types';
import { OsmosisMainnetDenoms, OsmosisTestnetDenoms } from '@models/Denom';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import Long from 'long';
import { DENOMS } from 'src/fixtures/denoms';
import { Pair } from '@models/Pair';
import constantine3Data from 'src/assetLists/constantine-3';
import archway1Data from 'src/assetLists/archway-1';
import { QueryClient, coin, setupBankExtension, setupStakingExtension } from '@cosmjs/stargate';

export type RouteResult = {
  route: string | undefined;
  feeRate: number;
  routeError: string | undefined;
};

export type ChainClient = {
  fetchDenoms: () => Promise<{ [x: string]: DenomInfo }>;
  fetchPairs: (
    chainId: ChainId,
    contractAddress: string,
    client: CosmWasmClient,
    startAfter?: string,
    allPairs?: Pair[],
  ) => Promise<Pair[]>;
  fetchTokenBalance: (address: string, tokenId: string) => Promise<Coin>;
  fetchBalances: (address: string) => Promise<Coin[]>;
  fetchValidators: () => Promise<{ validators: Validator[] }>;
  fetchRoute: (initialDenom: DenomInfo, targetDenom: DenomInfo, swapAmount: bigint) => Promise<RouteResult>;
};

async function fetchAllPairsFromSwapper(
  chainId: ChainId,
  contractAddress: string,
  client: CosmWasmClient,
  startAfter?: string,
  allPairs = [] as Pair[],
): Promise<Pair[]> {
  try {
    const { pairs } = await client!.queryContractSmart(contractAddress, {
      get_pairs: {
        limit: getPairsFetchLimit(chainId),
        start_after: startAfter,
      },
    });

    allPairs.push(...pairs);

    if (pairs.length === getPairsFetchLimit(chainId)) {
      const newStartAfter = pairs[pairs.length - 1];
      return await fetchAllPairsFromSwapper(chainId, contractAddress, client, newStartAfter, allPairs);
    }

    return allPairs;
  } catch (error) {
    console.error(error);
    return [];
  }
}

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
          name: asset.symbol,
          icon: asset.logo_URIs?.svg || asset.logo_URIs?.png,
          coingeckoId: asset.coingecko_id || '',
          significantFigures,
          ...overrides,
        }),
      };
    },
    {},
    assets,
  );
};

const fetchDenomsArchway = async (chainId: ChainId): Promise<{ [x: string]: DenomInfo }> => {
  const isTestnet = chainId === 'constantine-3';
  const url = isTestnet
    ? process.env.NEXT_PUBLIC_ARCHWAY_TESTNET_API_URL!
    : process.env.NEXT_PUBLIC_ARCHWAY_MAINNET_API_URL!;

  const fetchDenoms = async () => {
    try {
      const response = await fetch(url);
      return response.ok ? await response.json() : isTestnet ? constantine3Data : archway1Data;
    } catch (error) {
      return isTestnet ? constantine3Data : archway1Data;
    }
  };

  const { data: assets } = await fetchDenoms();

  return reduce(
    (acc: { [x: string]: DenomInfo }, asset: any) => ({
      ...acc,
      ...(asset.id in DENOMS[chainId] && DENOMS[chainId][asset.id]
        ? {
            [asset.id]: fromPartial({
              chain: chainId,
              id: asset.id,
              name: asset.label,
              significantFigures: asset.decimals,
              isCw20: !asset.isNative,
              coingeckoId: asset.geckoIDPriceSource,
              ...((asset.id in DENOMS[chainId] && DENOMS[chainId][asset.id]) || {}),
            }),
          }
        : {}),
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
    fetchPairs: fetchAllPairsFromSwapper,
    fetchTokenBalance: (address: string, tokenId: string) => cosmWasmClient!.getBalance(address, tokenId),
    fetchBalances: (address: string) =>
      queryClient.bank.allBalances(address, {
        key: Buffer.from(''),
        offset: Long.fromInt(0),
        limit: Long.fromInt(1000),
        countTotal: false,
        reverse: false,
      }),
    fetchValidators: async () =>
      (await queryClient.staking.validators('BOND_STATUS_BONDED')) as unknown as { validators: Validator[] },
    fetchRoute: async (_: DenomInfo, __: DenomInfo, ___: bigint) => ({
      route: undefined,
      feeRate: 0.0075,
      routeError: undefined,
    }),
  };
};

const osmosisChainClient = async (chainId: ChainId, cosmWasmClient: CosmWasmClient): Promise<ChainClient> => {
  const queryClient = await osmosis.ClientFactory.createRPCQueryClient({
    rpcEndpoint: getChainEndpoint(chainId),
  });

  return {
    fetchDenoms: () => fetchDenomsOsmosis(chainId),
    fetchPairs: async (
      _chainId: ChainId,
      _contractAddress: string,
      _client: CosmWasmClient,
      _startAfter?: string,
      _allPairs?: Pair[],
    ) => {
      const denoms = await fetchDenomsOsmosis(chainId);
      return values(
        reduce(
          (acc: { [x: string]: Pair }, denom: DenomInfo) => {
            const pairs: { [x: string]: Pair } = {};
            forEach((otherDenom: DenomInfo) => {
              if (denom.id !== otherDenom.id) {
                const key = join(
                  '-',
                  sort((a, b) => (a > b ? -1 : 1), [denom.id, otherDenom.id]),
                );
                pairs[key] = {
                  denoms: [denom.id, otherDenom.id],
                };
              }
            }, values(denoms));
            return { ...acc, ...pairs };
          },
          {},
          values(denoms),
        ),
      );
    },
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
    fetchValidators: async () =>
      (await queryClient.cosmos.staking.v1beta1.validators({
        status: 'BOND_STATUS_BONDED',
      })) as unknown as { validators: Validator[] },
    fetchRoute: async (initialDenom: DenomInfo, targetDenom: DenomInfo, swapAmount: bigint) => {
      try {
        const response = await fetch(
          `${getOsmosisRouterUrl(chainId!)}/router/quote?${new URLSearchParams({
            tokenIn: `${swapAmount}${initialDenom.id}`,
            tokenOutDenom: targetDenom!.id,
            singleRoute: 'true',
          })}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const error = await response.json();
          const errorMessages: { [x: string]: string } = {
            'no routes were provided': `No routes exist from ${initialDenom.name} to ${targetDenom.name} on Osmosis`,
          };
          return {
            route: undefined,
            feeRate: 0.0,
            routeError:
              errorMessages[error.message] ??
              `Unable to fetch a route from ${initialDenom.name} to ${targetDenom.name} on Osmosis`,
          };
        }

        const { route } = await response.json();

        return {
          route: Buffer.from(
            JSON.stringify(
              route.flatMap((r: any) =>
                r.pools.map((pool: any) => ({
                  pool_id: `${pool.id}`,
                  token_out_denom: pool.token_out_denom,
                })),
              ),
            ),
          ).toString('base64'),
          feeRate: 0.003,
          routeError: undefined,
        };
      } catch (error: any) {
        return {
          route: undefined,
          feeRate: 0.0,
          routeError: `Unable to fetch a route from ${initialDenom.name} to ${targetDenom.name} on Osmosis`,
        };
      }
    },
  };
};

const fetchDenomsNeutron = async (chainId: ChainId) => {
  const response = await fetch(
    `${getNeutronApiUrl(chainId)}/api/trpc/tokens.getAll?input={"json":{"chainId":"${chainId}"}}`,
  );

  const {
    data: { json: assets },
  } = await response.json();

  return reduce(
    (acc: { [x: string]: DenomInfo }, asset: any) => ({
      ...acc,
      ...(asset.id in DENOMS[chainId] && DENOMS[chainId][asset.id]
        ? {
            [asset.id]: fromPartial({
              chain: chainId,
              id: asset.token,
              name: asset.symbol ?? asset.token,
              significantFigures: asset.decimals,
              isCw20: (asset.token as string).startsWith('neutron1'),
              coingeckoId: asset.coingeckoId,
              ...((asset.id in DENOMS[chainId] && DENOMS[chainId][asset.id]) || {}),
            }),
          }
        : {}),
    }),
    {},
    assets,
  );
};

const neutronChainClient = async (chainId: ChainId, cosmWasmClient: CosmWasmClient): Promise<ChainClient> => {
  return {
    fetchDenoms: () => fetchDenomsNeutron(chainId),
    fetchPairs: async (
      _chainId: ChainId,
      _contractAddress: string,
      _client: CosmWasmClient,
      _startAfter?: string,
      _allPairs?: Pair[],
    ) => {
      const denoms = await fetchDenomsNeutron(chainId);
      console.log({ denoms });
      const pairs = values(
        reduce(
          (acc: { [x: string]: Pair }, denom: DenomInfo) => {
            const pairs: { [x: string]: Pair } = {};
            forEach((otherDenom: DenomInfo) => {
              if (denom.id !== otherDenom.id) {
                const key = join(
                  '-',
                  sort((a, b) => (a > b ? -1 : 1), [denom.id, otherDenom.id]),
                );
                pairs[key] = {
                  denoms: [denom.id, otherDenom.id],
                };
              }
            }, values(denoms));
            return { ...acc, ...pairs };
          },
          {},
          values(denoms),
        ),
      );

      console.log({ pairs });

      return pairs;
    },
    fetchTokenBalance: (address: string, tokenId: string) => Promise.resolve(coin(100, tokenId)), // cosmWasmClient!.getBalance(address, tokenId),
    fetchBalances: (address: string) => Promise.resolve([]), // queryClient.bank.allBalances(address),
    fetchValidators: () => Promise.resolve({ validators: [] }), // queryClient.staking.validators('BOND_STATUS_BONDED'),
    fetchRoute: async (_: DenomInfo, __: DenomInfo, ___: bigint) => ({
      route: undefined,
      feeRate: 0.0075,
      routeError: undefined,
    }),
  };
};

const fetchBalancesArchway = async (
  queryClient: any,
  cosmWasmClient: CosmWasmClient,
  chainId: ChainId,
  address: string,
) => {
  try {
    const [{ balances: nativeBalances }, denoms] = await Promise.all([
      queryClient.cosmos.bank.v1beta1.allBalances({
        address,
        pagination: {
          key: Buffer.from(''),
          offset: Long.fromInt(0),
          limit: Long.fromInt(1000),
          countTotal: false,
          reverse: false,
        },
      }),
      fetchDenomsArchway(chainId),
    ]);

    const cw20Balances = (
      await Promise.all(
        map(
          async (denom) => {
            try {
              const { balance } = await cosmWasmClient.queryContractSmart(denom.id, { balance: { address } });
              return { denom: denom.id, amount: balance };
            } catch (error) {
              console.error(error);
              return { denom: denom.id, amount: 0 };
            }
          },
          values(denoms).filter((denom) => denom.isCw20),
        ),
      )
    ).filter((balance) => BigInt(balance.amount) > 0);

    return [...nativeBalances, ...cw20Balances];
  } catch (error) {
    return [];
  }
};

const archwayChainClient = async (chainId: ChainId, cosmWasmClient: CosmWasmClient): Promise<ChainClient> => {
  const queryClient = await osmosis.ClientFactory.createRPCQueryClient({
    rpcEndpoint: getChainEndpoint(chainId),
  });

  return {
    fetchDenoms: () => fetchDenomsArchway(chainId),
    fetchPairs: async (
      _chainId: ChainId,
      contractAddress: string,
      client: CosmWasmClient,
      startAfter?: string,
      allPairs?: Pair[],
    ) => {
      const pairs = await fetchAllPairsFromSwapper(chainId, contractAddress, client, startAfter, allPairs);
      return pairs.filter((pair) => pair.denoms[0] !== pair.denoms[1]);
    },
    fetchTokenBalance: async (address: string, tokenId: string) =>
      (await fetchBalancesArchway(queryClient, cosmWasmClient, chainId, address)).find(
        (b: Coin) => b.denom === tokenId,
      ) ?? { denom: tokenId, amount: '0' },
    fetchBalances: (address: string) => fetchBalancesArchway(queryClient, cosmWasmClient, chainId, address),
    fetchValidators: async () =>
      (await queryClient.cosmos.staking.v1beta1.validators({
        status: 'BOND_STATUS_BONDED',
      })) as unknown as { validators: Validator[] },
    fetchRoute: async (_: DenomInfo, __: DenomInfo, ___: bigint) => ({
      route: undefined,
      feeRate: 0.0075,
      routeError: undefined,
    }), // TODO: understand fees
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

      if (NEUTRON_CHAINS.includes(chainId)) {
        return neutronChainClient(chainId, cosmWasmClient!);
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
