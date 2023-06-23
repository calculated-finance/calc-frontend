import { Strategy } from '@models/Strategy';
import { isNil } from 'lodash';

export function getWeightedScaleConfig(strategy: Strategy) {
  if (isNil(strategy.rawData.swap_adjustment_strategy)) {
    return null;
  }

  if (!('weighted_scale' in strategy.rawData.swap_adjustment_strategy)) {
    return null;
  }

  const { base_receive_amount, increase_only, multiplier } = strategy.rawData.swap_adjustment_strategy.weighted_scale;

  return {
    base_receive_amount,
    increase_only,
    multiplier,
  };
}

export function isWeightedScale(strategy: Strategy) {
  return Boolean(getWeightedScaleConfig(strategy));
}
