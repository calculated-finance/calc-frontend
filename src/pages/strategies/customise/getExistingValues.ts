import { Strategy } from '@models/Strategy';
import {
  getBasePrice,
  getConvertedSwapAmount,
  getPriceCeilingFloor,
  getSlippageTolerance,
  getStrategyExecutionIntervalData,
} from '@helpers/strategy';
import YesNoValues from '@models/YesNoValues';
import { getWeightedScaleConfig } from '@helpers/strategy/isWeightedScale';
import { Chains } from '@hooks/useChain/Chains';

export function getExistingValues(strategy: Strategy, chain: Chains) {
  const priceThreshold = getPriceCeilingFloor(strategy, chain);
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
    basePriceValue: getBasePrice(strategy, chain),
    swapMultiplier: getWeightedScaleConfig(strategy)?.multiplier,
    applyMultiplier: increaseOnly ? YesNoValues.No : YesNoValues.Yes,
    swapAmount,
  };
}
