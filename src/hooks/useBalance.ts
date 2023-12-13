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
  const { chainId } = useChainId();

  const client = useChainClient(chainId);

  const result = useQuery<Coin>(
    ['balance', token.id, chainId, address],
    () => client!.fetchTokenBalance(token.id, address!),
    {
      enabled: !!token && !!address && !!chainId && !!client,
      keepPreviousData: true,
      meta: {
        errorMessage: 'Error fetching balance',
      },
    },
  );

  return {
    displayAmount: result.data ? token.fromAtomic(Number(result.data.amount)) : 0,
    ...result,
  };
}

export default useBalance;
