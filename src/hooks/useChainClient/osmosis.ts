import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainEndpoint, getOsmosisRouterUrl } from '@helpers/chains';
import { ChainId } from '@models/ChainId';
import { InitialDenomInfo, ResultingDenomInfo, fromPartial } from '@utils/DenomInfo';
import { reduce, values, forEach, join, sort } from 'rambda';
import { osmosis } from 'osmojs';
import Long from 'long';
import { Pair } from '@models/Pair';
import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { DENOMS } from 'src/fixtures/denoms';
import { ChainClient } from './helpers';

const fetchDenoms = async (chainId: ChainId): Promise<{ [x: string]: InitialDenomInfo }> => {
  const baseUrl = 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main';
  const response = await fetch(`${baseUrl}/${chainId}/generated/frontend/assetlist.json`);
  const { assets } = await response.json();

  const allOverrides = DENOMS[chainId];

  return reduce(
    (acc: { [x: string]: InitialDenomInfo }, asset: any) => {
      const significantFigures = asset.decimals || 6;

      const denom = asset.coinMinimalDenom;
      const overrides = (denom in allOverrides && allOverrides[denom]) || {};

      return {
        ...acc,
        [denom]: fromPartial({
          chain: chainId,
          id: denom,
          name: asset.symbol,
          icon: asset.logoURIs?.svg || asset.logoURIs?.png,
          coingeckoId: asset.coingeckoId || '',
          significantFigures,
          ...overrides,
        }),
      };
    },
    {},
    assets,
  );
};

export const osmosisChainClient = async (chainId: ChainId, cosmWasmClient: CosmWasmClient): Promise<ChainClient> => {
  const queryClient = await osmosis.ClientFactory.createRPCQueryClient({
    rpcEndpoint: getChainEndpoint(chainId),
  });

  return {
    fetchDenoms: () => fetchDenoms(chainId),
    fetchPairs: async () => {
      const denoms = await fetchDenoms(chainId);
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
            }, values(denoms));
            return { ...acc, ...pairs };
          },
          {},
          values(denoms),
        ),
      );
    },
    fetchTokenBalance: (address: string, denom: InitialDenomInfo) => cosmWasmClient!.getBalance(address, denom.id),
    fetchBalances: async (address: string) => {
      const { balances } = await queryClient.cosmos.bank.v1beta1.allBalances({
        address,
        pagination: {
          key: Uint8Array.from(''),
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
    fetchRoute: async (initialDenom: InitialDenomInfo, targetDenom: ResultingDenomInfo, swapAmount: bigint) => {
      try {
        const response = await fetch(
          `${getOsmosisRouterUrl(chainId!)}/router/quote?${new URLSearchParams({
            tokenIn: `${swapAmount}${initialDenom.id}`,
            tokenOutDenom: targetDenom!.id,
            singleRoute: 'true',
          })}`,
          {
            method: 'GET',
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
