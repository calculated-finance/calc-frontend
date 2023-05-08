import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import {
  getStrategyPostSwapType,
  getStrategyValidatorAddress,
  getStrategyReinvestStrategyId,
} from '@helpers/destinations';
import SendToWalletValues from '@models/SendToWalletValues';
import { StrategyOsmosis } from '@hooks/useStrategies';
import { Chains } from '@hooks/useChain';
import { osmosisStrategy } from 'src/fixtures/strategy';
import { getExistingValues } from './getExistingValues'; // update with the actual path

jest.mock('@helpers/destinations');

describe('getExistingValues', () => {
  // A mock strategy object
  const mockStrategy: StrategyOsmosis = {
    ...osmosisStrategy,
    destinations: [{ address: 'mockAddress', allocation: '1.0' }],
  };
  const mockChain: Chains = Chains.Osmosis;
  const mockAddress = 'mockAddress';

  it('returns correct values for SendToWallet postPurchaseOption', () => {
    (getStrategyPostSwapType as jest.Mock).mockReturnValueOnce(PostPurchaseOptions.SendToWallet);

    const result = getExistingValues(mockStrategy, mockChain, mockAddress);

    expect(result).toEqual({
      postPurchaseOption: PostPurchaseOptions.SendToWallet,
      sendToWallet: SendToWalletValues.Yes,
    });
  });

  it('returns correct values for Stake postPurchaseOption', () => {
    (getStrategyPostSwapType as jest.Mock).mockReturnValueOnce(PostPurchaseOptions.Stake);
    (getStrategyValidatorAddress as jest.Mock).mockReturnValueOnce('validatorAddress');

    const result = getExistingValues(mockStrategy, mockChain, mockAddress);

    expect(result).toEqual({
      postPurchaseOption: PostPurchaseOptions.Stake,
      autoStakeValidator: 'validatorAddress',
    });
  });

  it('returns correct values for Reinvest postPurchaseOption', () => {
    (getStrategyPostSwapType as jest.Mock).mockReturnValueOnce(PostPurchaseOptions.Reinvest);
    (getStrategyReinvestStrategyId as jest.Mock).mockReturnValueOnce('reinvestStrategyId');

    const result = getExistingValues(mockStrategy, mockChain, mockAddress);

    expect(result).toEqual({
      postPurchaseOption: PostPurchaseOptions.Reinvest,
      reinvestStrategy: 'reinvestStrategyId',
    });
  });

  it('returns correct values for GenerateYield postPurchaseOption', () => {
    (getStrategyPostSwapType as jest.Mock).mockReturnValueOnce(PostPurchaseOptions.GenerateYield);

    const result = getExistingValues(mockStrategy, mockChain, mockAddress);

    expect(result).toEqual({
      postPurchaseOption: PostPurchaseOptions.GenerateYield,
      yieldOption: 'mars',
    });
  });
});
