import { useWallet } from '@hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { Coin } from '@cosmjs/proto-signing';
import { useCosmWasmClient } from './useCosmWasmClient';

export type BalanceResponse = {
  amount: number;
};

export function getDisplayAmount(token: DenomInfo, amount: number) {
  return token.conversion(amount);
}

const useBalance = (token: DenomInfo) => {
  const { address } = useWallet();
  const client = useCosmWasmClient((state) => state.client);

  const result = useQuery<Coin>(
    ['balance', token?.id, address, client],
    () => {
      if (!client) {
        throw new Error('Client not initialized');
      }
      if (!address) {
        throw new Error('No address provided');
      }
      return client.getBalance(address, token.id);
    },
    {
      enabled: !!token && !!address && !!client,
      keepPreviousData: true,
      meta: {
        errorMessage: 'Error fetching balance',
      },
    },
  );

  return {
    displayAmount: result.data ? getDisplayAmount(token, Number(result.data.amount)) : 0,

    ...result,
  };
};

export default useBalance;
