import { useWallet } from '@hooks/useWallet';
import useQueryWithNotification from './useQueryWithNotification';
import { useChainId } from './useChainId';
import { useSupportedDenoms } from './useSupportedDenoms';
import { useChainClient } from './useChainClient';

const useBalances = (injectedAddress: string | null = null) => {
  const { address: walletAddress } = useWallet();
  const { chainId } = useChainId();
  const client = useChainClient(chainId);
  const supportedDenoms = useSupportedDenoms();

  const address = injectedAddress ?? walletAddress;

  return useQueryWithNotification(
    ['balances', chainId, address],
    () =>
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
