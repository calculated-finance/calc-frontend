import { useQuery } from '@tanstack/react-query';
import { useCWClient } from '@wizard-ui/react';

export type BalanceResponse = {
  amount: number;
};

interface UseBalanceArgs {
  token?: string;
  address?: string;
}

const useBalance = ({ token, address }: UseBalanceArgs) => {
  const client = useCWClient();

  return useQuery(['balance', token, address], () => client!.getBalance(address!, token!), {
    enabled: !!token && !!address && !!client,
  });
};

export default useBalance;
