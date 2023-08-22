import { Strategy } from '@models/Strategy';
import {
  getBasePrice,
  getPriceCeilingFloor,
  getSlippageTolerance,
  getStrategyBalance,
  getStrategyExecutionIntervalData,
  getSwapAmount,
} from '@helpers/strategy';
import YesNoValues from '@models/YesNoValues';
import { getWeightedScaleConfig } from '@helpers/strategy/isWeightedScale';
import { Chains } from '@hooks/useChain/Chains';

export function getExistingValues(strategy: Strategy, chain: Chains) {
  const priceThreshold = getPriceCeilingFloor(strategy, chain);
  const { timeIncrement, timeInterval } = getStrategyExecutionIntervalData(strategy);
  const increaseOnly = getWeightedScaleConfig(strategy)?.increase_only;
  const initialDenom = strategy.rawData.deposited_amount.denom;
  const resultingDenom = strategy.rawData.received_amount.denom;
  const slippageTolerance = getSlippageTolerance(strategy);
  const swapAmount = getSwapAmount(strategy);
  const balance = getStrategyBalance(strategy);
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
    balance,
    initialDenom,
    resultingDenom,
  };
}
