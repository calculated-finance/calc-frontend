import { Coin } from '@cosmjs/stargate';
import getDenomInfo from '@utils/getDenomInfo';
import { useWallet } from '@hooks/useWallet';
import useQueryWithNotification from './useQueryWithNotification';
import { useCosmWasmClient } from './useCosmWasmClient';

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
  const { address } = useWallet();
  const client = useCosmWasmClient((state) => state.client);

  const result = useQueryWithNotification<Coin>(
    ['balance', token, address, client],
    () => {
      if (!client) {
        throw new Error('Client not initialized');
      }
      if (!address) {
        throw new Error('No address provided');
      }
      const res = client.getBalance(address, token ?? '');

      return res;
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
