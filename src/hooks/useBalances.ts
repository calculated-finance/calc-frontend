import { useWallet } from '@hooks/useWallet';
import useQueryWithNotification from './useQueryWithNotification';
import { useChainId } from './useChainId';
import { useChainClient } from './useChainClient';

const useBalances = (injectedAddress: string | null = null) => {
  const { address: walletAddress } = useWallet();
  const { chainId } = useChainId();
  const client = useChainClient(chainId);

  const address = injectedAddress ?? walletAddress;

  const { data: balances, ...helpers } = useQueryWithNotification(
    ['balances', chainId, address],
    () => client!.fetchBalances(address!),
    {
      enabled: !!address && !!client,
      meta: {
        errorMessage: `Error fetching balances for ${address}`,
      },
    },
  );

  return {
    balances,
    ...helpers,
  };
};

export default useBalances;
