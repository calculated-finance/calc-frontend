import {
  getBasePrice,
  getPriceCeilingFloor,
  getSlippageTolerance,
  getStrategyExecutionIntervalData,
} from '@helpers/strategy';
import { getWeightedScaleConfig } from '@helpers/strategy/isWeightedScale';
import YesNoValues from '@models/YesNoValues';
import { Strategy } from '@hooks/useStrategies';
import { getExistingValues } from './getExistingValues';

jest.mock('@helpers/strategy', () => ({
  getBasePrice: jest.fn(),
  getPriceCeilingFloor: jest.fn(),
  getSlippageTolerance: jest.fn(),
  getStrategyExecutionIntervalData: jest.fn(),
}));

jest.mock('@helpers/strategy/isWeightedScale', () => ({
  getWeightedScaleConfig: jest.fn(),
}));

describe('getExistingValues', () => {
  it('should return the correct values', () => {
    const mockStrategy = {};

    (getBasePrice as jest.Mock).mockReturnValue(100);
    (getPriceCeilingFloor as jest.Mock).mockReturnValue(50);
    (getSlippageTolerance as jest.Mock).mockReturnValue(0.01);
    (getStrategyExecutionIntervalData as jest.Mock).mockReturnValue({ timeIncrement: 5, timeInterval: 'hours' });
    (getWeightedScaleConfig as jest.Mock).mockReturnValue({ increase_only: true, multiplier: 2 });

    const result = getExistingValues(mockStrategy as Strategy);

    expect(result).toEqual({
      advancedSettings: true,
      executionInterval: 'hours',
      executionIntervalIncrement: 5,
      slippageTolerance: 0.01,
      priceThresholdEnabled: YesNoValues.Yes,
      priceThresholdValue: 50,
      basePriceIsCurrentPrice: YesNoValues.No,
      basePriceValue: 100,
      swapMultiplier: 2,
      applyMultiplier: YesNoValues.No,
    });
  });

  it('should handle cases when timeIncrement is falsy', () => {
    const mockStrategy = {};

    (getBasePrice as jest.Mock).mockReturnValue(100);
    (getPriceCeilingFloor as jest.Mock).mockReturnValue(50);
    (getSlippageTolerance as jest.Mock).mockReturnValue(0.01);
    (getStrategyExecutionIntervalData as jest.Mock).mockReturnValue({ timeIncrement: 0, timeInterval: 'hours' });
    (getWeightedScaleConfig as jest.Mock).mockReturnValue({ increase_only: true, multiplier: 2 });

    const result = getExistingValues(mockStrategy as Strategy);

    expect(result.executionIntervalIncrement).toBe(1);
  });

  it('should handle cases when priceThreshold is falsy', () => {
    const mockStrategy = {};

    (getBasePrice as jest.Mock).mockReturnValue(100);
    (getPriceCeilingFloor as jest.Mock).mockReturnValue(null);
    (getSlippageTolerance as jest.Mock).mockReturnValue(0.01);
    (getStrategyExecutionIntervalData as jest.Mock).mockReturnValue({ timeIncrement: 5, timeInterval: 'hours' });
    (getWeightedScaleConfig as jest.Mock).mockReturnValue({ increase_only: true, multiplier: 2 });

    const result = getExistingValues(mockStrategy as Strategy);

    expect(result.priceThresholdEnabled).toBe(YesNoValues.No);
  });
});
