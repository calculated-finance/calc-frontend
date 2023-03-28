import { useWallet } from '@hooks/useWallet';
import { Coin } from '@cosmjs/stargate';
import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import useQueryWithNotification from './useQueryWithNotification';
import { useNetwork } from './useNetwork';

const useBalances = () => {
  const { address } = useWallet();
  const [{ query }] = useNetwork();

  const { data, ...other } = useQueryWithNotification(
    ['balances', address],
    async () => query?.bank.allBalances(address),
    {
      enabled: !!address && !!query,
      cacheTime: 0,
    },
  );

  return {
    data: {
      ...data,
      balances: data?.filter((balance: Coin) => SUPPORTED_DENOMS.includes(balance.denom)) || [],
    },
    ...other,
  };
};

export default useBalances;
