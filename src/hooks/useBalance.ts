import { useWallet } from '@hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { Coin } from '@cosmjs/proto-signing';
import { useChainId } from './useChainId';
import { useChainClient } from './useChainClient';

export type BalanceResponse = {
  amount: number;
};

function useBalance(token: DenomInfo) {
  const { address } = useWallet();
  const { chainId: chain } = useChainId();

  const client = useChainClient(chain);

  const result = useQuery<Coin>(
    ['balance', token?.id, address, client],
    () => {
      if (!client) {
        throw new Error('Client not initialized');
      }
      if (!address) {
        throw new Error('No address provided');
      }
      if (!token) {
        throw new Error('No token provided');
      }
      return client.fetchTokenBalance(token.id, address);
    },
    {
      enabled: !!token && !!address && !!chain && !!client,
      keepPreviousData: true,
      meta: {
        errorMessage: 'Error fetching balance',
      },
    },
  );

  return {
    displayAmount: result.data ? token.conversion(Number(result.data.amount)) : 0,

    ...result,
  };
}

export default useBalance;
