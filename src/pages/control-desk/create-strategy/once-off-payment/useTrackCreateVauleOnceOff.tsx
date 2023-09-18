import { useWallet } from '@hooks/useWallet';
import { useChain } from '@hooks/useChain';
import { useAnalytics } from '@hooks/useAnalytics';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { useControlDeskStrategyInfo } from '../../useControlDeskStrategyInfo';

export function useTrackCreateVaultOnceOff() {
  const { chain } = useChain();
  const { formName } = useControlDeskStrategyInfo();
  const { address: senderAddress } = useWallet();
  const { walletType } = useWallet();
  const { track } = useAnalytics();

  return () => {
    track('Strategy Created', { formName, chain, address: senderAddress, walletType });
  };
}
