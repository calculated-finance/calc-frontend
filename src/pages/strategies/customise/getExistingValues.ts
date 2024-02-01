import { Strategy } from '@models/Strategy';
import {
  getBasePrice,
  getConvertedSwapAmount,
  getPriceThreshold,
  getSlippageTolerance,
  getStrategyExecutionIntervalData,
} from '@helpers/strategy';
import YesNoValues from '@models/YesNoValues';
import { getWeightedScaleConfig } from '@helpers/strategy/isWeightedScale';

export function getExistingValues(strategy: Strategy) {
  const priceThreshold = getPriceThreshold(strategy);
  const { timeIncrement, timeInterval } = getStrategyExecutionIntervalData(strategy);
  const increaseOnly = getWeightedScaleConfig(strategy)?.increase_only;
  const slippageTolerance = getSlippageTolerance(strategy);
  const swapAmount = getConvertedSwapAmount(strategy);

  return {
    advancedSettings: true,
    executionInterval: timeInterval,
    executionIntervalIncrement: timeIncrement || 1,
    slippageTolerance,
    priceThresholdEnabled: priceThreshold ? YesNoValues.Yes : YesNoValues.No,
    priceThresholdValue: priceThreshold,
    basePriceIsCurrentPrice: YesNoValues.No,
    basePriceValue: getBasePrice(strategy),
    swapMultiplier: getWeightedScaleConfig(strategy)?.multiplier,
    applyMultiplier: increaseOnly ? YesNoValues.No : YesNoValues.Yes,
    swapAmount,
  };
}
