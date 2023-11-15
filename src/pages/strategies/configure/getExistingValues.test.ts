import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import {
  getStrategyPostSwapType,
  getStrategyValidatorAddress,
  getStrategyReinvestStrategyId,
} from '@helpers/destinations';
import { ChainId } from '@hooks/useChain/Chains';
import { dcaInStrategyViewModal } from 'src/fixtures/strategy';
import YesNoValues from '@models/YesNoValues';
import { Strategy } from '@models/Strategy';
import { getExistingValues } from './getExistingValues'; // update with the actual path

jest.mock('@helpers/destinations');

describe('getExistingValues', () => {
  // A mock strategy object
  const mockStrategy: Strategy = {
    ...dcaInStrategyViewModal,
    rawData: {
      ...dcaInStrategyViewModal.rawData,
      destinations: [{ address: 'mockAddress', allocation: '1.0' }],
    },
  };
  const mockChain: ChainId = 'osmosis-1';
  const mockAddress = 'mockAddress';

  it('returns correct values for SendToWallet postPurchaseOption', () => {
    (getStrategyPostSwapType as jest.Mock).mockReturnValueOnce(PostPurchaseOptions.SendToWallet);

    const result = getExistingValues(mockStrategy, mockChain, mockAddress);

    expect(result).toEqual({
      postPurchaseOption: PostPurchaseOptions.SendToWallet,
      sendToWallet: YesNoValues.Yes,
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
