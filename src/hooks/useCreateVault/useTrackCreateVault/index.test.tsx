import { useWallet } from '@hooks/useWallet';
import { useChainId } from '@hooks/useChainId';
import { useAnalytics } from '@hooks/useAnalytics';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { useTrackCreateVault } from '.'; // adjust this import according to your project structure

jest.mock('@hooks/useWallet');
jest.mock('@hooks/useChain');
jest.mock('@hooks/useAnalytics');
jest.mock('src/pages/create-strategy/dca-in/customise/useStrategyInfo');

describe('useTrackCreateVault function', () => {
  it('should track "Strategy Created" event with correct parameters', () => {
    // Mock hook values
    (useChainId as jest.Mock).mockReturnValue({ chain: 'mockChain' });
    (useStrategyInfo as jest.Mock).mockReturnValue({ formName: 'mockFormName' });
    (useWallet as jest.Mock).mockReturnValue({ address: 'mockAddress', walletType: 'mockWalletType' });
    (useAnalytics as jest.Mock).mockReturnValue({
      track: jest.fn(),
    });

    const trackCreateVault = useTrackCreateVault();
    trackCreateVault();

    expect(useAnalytics().track).toHaveBeenCalledWith('Strategy Created', {
      formName: 'mockFormName',
      chain: 'mockChain',
      address: 'mockAddress',
      walletType: 'mockWalletType',
    });
  });
});
