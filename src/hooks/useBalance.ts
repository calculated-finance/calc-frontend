import { Coin } from '@cosmjs/stargate';
import getDenomInfo from '@utils/getDenomInfo';
import { useWallet } from '@hooks/useWallet';
import useQueryWithNotification from './useQueryWithNotification';

export type BalanceResponse = {
  amount: number;
};

interface UseBalanceArgs {
  token?: string;
}

export function getDisplayAmount(token: string | undefined, amount: number) {
  return Number(getDenomInfo(token).conversion(amount));
}

const useBalance = ({ token }: UseBalanceArgs) => {
  const { address, client } = useWallet();

  const result = useQueryWithNotification<Coin>(
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
    displayAmount: result.data ? getDisplayAmount(token, Number(result.data.amount)) : 0,
    ...result,
  };
};

export default useBalance;
