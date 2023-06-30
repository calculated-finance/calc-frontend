import { Chains } from '@hooks/useChain/Chains';
import { defaultDenom } from '@utils/defaultDenom';
import { TransactionType } from '@components/TransactionType';
import YesNoValues from '@models/YesNoValues';
import { dcaInStrategyViewModal } from 'src/fixtures/strategy';
import { buildPriceThreshold } from './buildPriceThreshold';
import { buildSlippageTolerance } from './buildSlippageTolerance';
import { buildSwapAdjustmentStrategy } from './buildSwapAdjustmentStrategy';
import { buildTimeInterval } from './buildTimeInterval';
import { getUpdateVaultMessage } from './getUpdateVaultMessage';

jest.mock('./buildTimeInterval');
jest.mock('./buildSlippageTolerance');
jest.mock('./buildSwapAdjustmentStrategy');
jest.mock('./buildPriceThreshold');

describe('getUpdateVaultMessage', () => {
  it('should return an object with proper structure', () => {
    const variables = {
      strategy: { ...dcaInStrategyViewModal, id: 'test-id' },
      values: {
        slippageTolerance: 0.1,
        priceThresholdEnabled: YesNoValues.No,
        priceThresholdValue: undefined,
        advancedSettings: false,
      },
      initialValues: {
        slippageTolerance: 0.1,
        priceThresholdEnabled: YesNoValues.No,
        priceThresholdValue: undefined,
        advancedSettings: false,
      },
      context: {
        initialDenom: { ...defaultDenom, id: 'test-denom' },
        swapAmount: 1,
        resultingDenom: { ...defaultDenom, id: 'test-denom' },
        transactionType: TransactionType.Buy,
        currentPrice: 1.5,
        chain: Chains.Kujira,
      },
    };

    const result = getUpdateVaultMessage(variables);

    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('update_vault');
    expect(result).toEqual({ update_vault: { vault_id: 'test-id' } });
  });

  it('should merge objects from helper functions correctly', () => {
    const mockTimeInterval = { timeInterval: 'mock' };
    const mockSlippageTolerance = { slippageTolerance: 'mock' };
    const mockSwapAdjustmentStrategy = { swapAdjustmentStrategy: 'mock' };
    const mockPriceThreshold = { priceThreshold: 'mock' };

    (buildTimeInterval as jest.Mock).mockReturnValue(mockTimeInterval);
    (buildSlippageTolerance as jest.Mock).mockReturnValue(mockSlippageTolerance);
    (buildSwapAdjustmentStrategy as jest.Mock).mockReturnValue(mockSwapAdjustmentStrategy);
    (buildPriceThreshold as jest.Mock).mockReturnValue(mockPriceThreshold);

    const variables = {
      strategy: { ...dcaInStrategyViewModal, id: 'test-id' },
      values: {
        slippageTolerance: 0.1,
        priceThresholdEnabled: YesNoValues.No,
        priceThresholdValue: undefined,
        advancedSettings: false,
      },
      initialValues: {
        slippageTolerance: 0.1,
        priceThresholdEnabled: YesNoValues.No,
        priceThresholdValue: undefined,
        advancedSettings: false,
      },
      context: {
        initialDenom: { ...defaultDenom, id: 'test-denom' },
        swapAmount: 1,
        resultingDenom: { ...defaultDenom, id: 'test-denom' },
        transactionType: TransactionType.Buy,
        currentPrice: 1.5,
        chain: Chains.Kujira,
      },
    };

    const result = getUpdateVaultMessage(variables);

    expect(result).toMatchObject({
      update_vault: {
        vault_id: 'test-id',
        ...mockPriceThreshold,
        ...mockSlippageTolerance,
        ...mockTimeInterval,
        ...mockSwapAdjustmentStrategy,
      },
    });
  });
});
