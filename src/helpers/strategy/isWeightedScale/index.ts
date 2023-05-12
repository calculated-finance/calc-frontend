import { Strategy, StrategyOsmosis } from '@hooks/useStrategies';
import { isNil } from 'lodash';

export function getWeightedScaleConfig(strategy: Strategy | StrategyOsmosis) {
  const osmosisStrategy = strategy as StrategyOsmosis;

  if (isNil(osmosisStrategy.swap_adjustment_strategy)) {
    return null;
  }

  if (!('weighted_scale' in osmosisStrategy.swap_adjustment_strategy)) {
    return null;
  }

  const { base_receive_amount, increase_only, multiplier } = osmosisStrategy.swap_adjustment_strategy.weighted_scale;

  return {
    base_receive_amount,
    increase_only,
    multiplier,
  };
}

export function isWeightedScale(strategy: Strategy | StrategyOsmosis) {
  return Boolean(getWeightedScaleConfig(strategy));
}
