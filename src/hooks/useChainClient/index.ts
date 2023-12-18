import { ChainId } from '@hooks/useChainId/Chains';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { kujiraQueryClient } from 'kujira.js';
import { Coin } from '@models/index';
import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { getChainEndpoint, getOsmosisRouterUrl } from '@helpers/chains';
import { osmosis } from 'osmojs';
import { useQuery } from '@tanstack/react-query';
import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { DenomInfo } from '@utils/DenomInfo';
import getDenomInfo from '@utils/getDenomInfo';

export type ChainClient = {
  fetchTokenBalance: (tokenId: string, address: string) => Promise<Coin>;
  fetchBalances: (address: string) => Promise<Coin[]>;
  fetchValidators: () => Promise<{ validators: Validator[] }>;
  fetchRoute: (swapAmount: Coin, targetDenom: DenomInfo) => Promise<{ route: string | undefined; feeRate: number }>;
};

export function useChainClient(chainId: ChainId) {
  const { cosmWasmClient } = useCosmWasmClient(chainId);

  const { data: chainClient } = useQuery<ChainClient>(
    ['chainClient', chainId],
    async () => {
      if (['kaiyo-1', 'harpoon-4'].includes(chainId)) {
        const client = await Tendermint34Client.create(
          new HttpBatchClient(getChainEndpoint(chainId), {
            dispatchInterval: 100,
            batchSizeLimit: 200,
          }),
        );

        const queryClient = kujiraQueryClient({ client: client as any });

        return {
          fetchTokenBalance: (tokenId: string, address: string) => cosmWasmClient!.getBalance(address, tokenId),
          fetchBalances: async (address: string) => {
            const balances = await queryClient.bank.allBalances(address);
            return balances;
          },
          fetchValidators: async () => {
            const response = await queryClient.staking.validators('BOND_STATUS_BONDED');
            return response as unknown as { validators: Validator[] };
          },
          fetchRoute: async (_: Coin, __: DenomInfo) => ({ route: undefined, feeRate: 0.0075 }),
        };
      }

      if (['osmosis-1', 'osmo-test-5'].includes(chainId)) {
        const queryClient = await osmosis.ClientFactory.createRPCQueryClient({
          rpcEndpoint: getChainEndpoint(chainId),
        });

        return {
          fetchTokenBalance: (tokenId: string, address: string) => cosmWasmClient!.getBalance(address, tokenId),
          fetchBalances: async (address: string) => {
            const { balances } = await queryClient.cosmos.bank.v1beta1.allBalances({ address });
            return balances;
          },
          fetchValidators: async () => {
            const response = await queryClient.cosmos.staking.v1beta1.validators({
              status: 'BOND_STATUS_BONDED',
            });
            return response as unknown as { validators: Validator[] };
          },
          fetchRoute: async (swapAmount: Coin, targetDenom: DenomInfo) => {
            try {
              const response = await (
                await fetch(
                  `${getOsmosisRouterUrl(chainId!)}/router/single-quote?${new URLSearchParams({
                    tokenIn: `${swapAmount!.amount}${swapAmount!.denom}`,
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
                const initialDenomInfo = getDenomInfo(swapAmount!.denom);
                throw new Error(
                  `Swap amount of ${initialDenomInfo.fromAtomic(Number(swapAmount!.amount))} ${
                    initialDenomInfo.name
                  } too high to find dynamic osmosis route.`,
                );
              }

              throw new Error('Error fetching route from Osmosis');
            }
          },
        };
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
