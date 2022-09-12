import { useQuery } from '@tanstack/react-query';
import { useCWClient } from '@wizard-ui/react';

export type BalanceResponse = {
  balance: string;
};

interface UseBalanceArgs {
  token: string;
  address: string;
}

const useBalance = ({ token, address }: UseBalanceArgs) => {
  const client = useCWClient();

  const { data, ...rest } = useQuery(['balance', token, address], () => {
    if (address == null || client == null || token == null) {
      throw new Error('Error in fetching balance');
    }

    return client.getBalance(address, token);
  });

  if (data == null) {
    return { data, ...rest };
  }

  return { data: data.amount, ...rest };
};

export default useBalance;
