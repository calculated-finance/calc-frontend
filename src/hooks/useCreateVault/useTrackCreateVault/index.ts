import { useWallet } from '@hooks/useWallet';
import { useChainId } from '@hooks/useChainId';
import { useAnalytics } from '@hooks/useAnalytics';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';

export function useTrackCreateVault() {
  const { chainId: chain } = useChainId();
  const { formName } = useStrategyInfo();
  const { address: senderAddress } = useWallet();
  const { walletType } = useWallet();
  const { track } = useAnalytics();

  return () => {
    track('Strategy Created', { formName, chain, address: senderAddress, walletType });
  };
}
