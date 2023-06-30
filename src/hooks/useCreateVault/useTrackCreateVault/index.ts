import { useWallet } from '@hooks/useWallet';
import { useChain } from '@hooks/useChain';
import { useAnalytics } from '@hooks/useAnalytics';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';

export function useTrackCreateVault() {
  const { chain } = useChain();
  const { formName } = useStrategyInfo();
  const { address: senderAddress } = useWallet();
  const { walletType } = useWallet();
  const { track } = useAnalytics();

  return () => {
    track('Strategy Created', { formName, chain, address: senderAddress, walletType });
  };
}
