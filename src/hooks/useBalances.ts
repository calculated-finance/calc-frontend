import 'isomorphic-fetch';
import { useWallet } from '@wizard-ui/react';
import { REST_ENDPOINT } from 'src/constants';
import { Coin } from '@cosmjs/stargate';
import useQueryWithNotification from './useQueryWithNotification';

type BalanceResponse = {
  balances: Coin[];
  pagination: {
    next_key: string;
    total: number;
  };
};

const useBalances = () => {
  const { address } = useWallet();

  return useQueryWithNotification<BalanceResponse>(
    ['balances', address],
    async () => {
      const result = await fetch(`${REST_ENDPOINT}/cosmos/bank/v1beta1/balances/${address}`);
      return result.json();
    },
    {
      enabled: !!address,
      cacheTime: 0,
    },
  );
};

export default useBalances;
