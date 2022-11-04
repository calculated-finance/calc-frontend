import { Coin } from '@cosmjs/stargate';
import { useQuery } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { useWallet } from '@wizard-ui/react';

export type BalanceResponse = {
  amount: number;
};

interface UseBalanceArgs {
  token?: string;
}

const useBalance = ({ token }: UseBalanceArgs) => {
  const { address, client } = useWallet();

  const result = useQuery<Coin>(
    ['balance', token, address, client],
    () => {
      if (!client) {
        throw new Error('Client not initialized');
      }
      if (!address) {
        throw new Error('No address provided');
      }
      return client.getBalance(address, token ?? '');
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
