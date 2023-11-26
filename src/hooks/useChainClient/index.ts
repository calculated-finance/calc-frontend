import { ChainId } from '@hooks/useChainId/Chains';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { kujiraQueryClient } from 'kujira.js';
import { Coin } from '@models/index';
import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { getChainEndpoint } from '@helpers/chains';
import { osmosis } from 'osmojs';
import { useQuery } from '@tanstack/react-query';
import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';

export type ChainClient = {
  fetchTokenBalance: (tokenId: string, address: string) => Promise<Coin>;
  fetchBalances: (address: string, supportedDenoms: string[]) => Promise<Coin[]>;
  fetchValidators: () => Promise<{ validators: Validator[] }>;
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
          fetchBalances: async (address: string, supportedDenoms: string[]) => {
            const balances = await queryClient.bank.allBalances(address);
            return balances.filter((balance: Coin) => supportedDenoms.includes(balance.denom));
          },
          fetchValidators: async () => {
            const response = await queryClient.staking.validators('BOND_STATUS_BONDED');
            return response as { validators: Validator[] };
          },
        };
      }

      if (['osmosis-1', 'osmo-test-5'].includes(chainId)) {
        const queryClient = await osmosis.ClientFactory.createRPCQueryClient({
          rpcEndpoint: getChainEndpoint(chainId),
        });

        return {
          fetchTokenBalance: (tokenId: string, address: string) => cosmWasmClient!.getBalance(address, tokenId),
          fetchBalances: async (address: string, supportedDenoms: string[]) => {
            const { balances: allBalances } = await queryClient.cosmos.bank.v1beta1.allBalances({ address });
            return allBalances.filter((balance: Coin) => supportedDenoms.includes(balance.denom));
          },
          fetchValidators: async () => {
            const response = await queryClient.cosmos.staking.v1beta1.validators({
              status: 'BOND_STATUS_BONDED',
            });
            return response as { validators: Validator[] };
          },
        };
      }

      throw new Error(`Unsupported chain ${chainId}`);
    },
    {
      enabled: !!chainId && !!cosmWasmClient,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      meta: {
        errorMessage: 'Error fetching chain client',
      },
    },
  );

  return chainClient;
}
