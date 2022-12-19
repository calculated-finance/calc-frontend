import { Strategy } from '@hooks/useStrategies';
import { StrategyTypes } from '@models/StrategyTypes';
import getDenomInfo from '@utils/getDenomInfo';
import { getStrategyInitialDenom } from './getStrategyInitialDenom';
import { getStrategyResultingDenom } from './getStrategyResultingDenom';
import { isStrategyScheduled } from './getStrategyStatus';
import { getStrategyType } from './getStrategyType';

export function getStrategyStartDate(strategy: Strategy) {
  const { trigger } = strategy;
  if (trigger && 'fin_limit_order' in trigger) {
    const { priceDeconversion } = getDenomInfo(getStrategyResultingDenom(strategy));
    const price = priceDeconversion(Number(trigger.fin_limit_order.target_price));
    const initialDenom = getStrategyInitialDenom(strategy);
    const resultingDenom = getStrategyResultingDenom(strategy);
    if (getStrategyType(strategy) === StrategyTypes.DCAIn) {
      return `When ${getDenomInfo(resultingDenom).name} hits ${price} ${getDenomInfo(initialDenom).name}`;
    }
    return `When ${getDenomInfo(initialDenom).name} hits ${price} ${getDenomInfo(resultingDenom).name}`;
  }

  if (isStrategyScheduled(strategy) && trigger && 'time' in trigger && trigger.time.target_time) {
    return new Date(Number(trigger.time.target_time) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return strategy.started_at
    ? new Date(Number(strategy.started_at) / 1000000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '-';
}
