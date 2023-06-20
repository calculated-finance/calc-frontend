import { useWallet } from '@hooks/useWallet';
import useQueryWithNotification from './useQueryWithNotification';
import { useChain } from './useChain';
import { useSupportedDenoms } from './useSupportedDenoms';
import { useCalcClient } from './useCalcClient';

const useBalances = () => {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCalcClient(chain);
  const supportedDenoms = useSupportedDenoms();

  return useQueryWithNotification(
    ['balances', address, client, supportedDenoms],
    async () => {
      if (!address) {
        throw new Error('No address');
      }
      if (!client) {
        throw new Error('No client');
      }
      return client.fetchBalances(
        address,
        supportedDenoms.map((sd) => sd.id),
      );
    },
    {
      enabled: !!address && !!supportedDenoms && !!client,
      cacheTime: 0,
      meta: {
        errorMessage: 'Error fetching balances',
      },
    },
  );
};

export default useBalances;
