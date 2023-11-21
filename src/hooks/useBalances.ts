import { useWallet } from '@hooks/useWallet';
import useQueryWithNotification from './useQueryWithNotification';
import { useChainId } from './useChainId';
import { useSupportedDenoms } from './useSupportedDenoms';
import { useChainClient } from './useChainClient';

const useBalances = (injectedAddress: string | null = null) => {
  const { address: walletAddress } = useWallet();
  const address = injectedAddress ?? walletAddress;
  const { chainId } = useChainId();
  const client = useChainClient(chainId);
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
