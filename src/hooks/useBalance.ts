import { useQuery } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { useCWClient, useWallet } from '@wizard-ui/react';

export type BalanceResponse = {
  amount: number;
};

interface UseBalanceArgs {
  token?: string;
}

const useBalance = ({ token }: UseBalanceArgs) => {
  const { address } = useWallet();
  const client = useCWClient();

  const result = useQuery(
    ['balance', token, address],
    () => {
      if (!client) {
        throw new Error('Client not initialized');
      }
      return client.getBalance(address!, token ?? '');
    },
    {
      enabled: !!token && !!address && !!client,
      keepPreviousData: true,
    },
  );

  return {
    displayAmount: result.data ? Number(getDenomInfo(token).conversion(Number(result.data.amount))) : 0,
    ...result,
  };
};

export default useBalance;
