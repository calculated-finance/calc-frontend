import { Chains } from '@hooks/useChain/Chains';
import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
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
      strategy: { id: 'test-id' },
      values: { slippageTolerance: 'test-slippage' },
      initialValues: { slippageTolerance: 'test-initial-slippage' },
    };
    const chain = Chains.Kujira;

    const result = getUpdateVaultMessage(variables as any, chain) as any;

    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('update_vault');
    expect(result.update_vault).toHaveProperty('vault_id');
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
      strategy: { id: 'test-id' },
      values: { slippageTolerance: 'test-slippage' },
      initialValues: { slippageTolerance: 'test-initial-slippage' },
    };
    const chain = Chains.Kujira;

    const result = getUpdateVaultMessage(variables as any, chain) as any;

    expect(result.update_vault).toMatchObject({
      vault_id: 'test-id',
      ...mockPriceThreshold,
      ...mockSlippageTolerance,
      ...mockTimeInterval,
      ...mockSwapAdjustmentStrategy,
    });
  });
});
