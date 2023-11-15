import { useWallet } from '@hooks/useWallet';
import useQueryWithNotification from './useQueryWithNotification';
import { useChain } from './useChain';
import { useSupportedDenoms } from './useSupportedDenoms';
import { useChainClient } from './useChainClient';

const useBalances = (injectedAddress: string | null = null) => {
  const { address } = injectedAddress ? { address: injectedAddress } : useWallet();
  const { chain } = useChain();
  const client = useChainClient(chain);
  const supportedDenoms = useSupportedDenoms();

  return useQueryWithNotification(
    ['balances', address, client, supportedDenoms],
    async () =>
      client!.fetchBalances(
        address!,
        supportedDenoms.map((sd) => sd.id),
      ),
    {
      enabled: !!address && !!supportedDenoms && !!client,
      cacheTime: 0,
      meta: {
        errorMessage: `Error fetching balances for ${address}`,
      },
    },
  );
};

export default useBalances;
