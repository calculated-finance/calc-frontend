import { Strategy } from '@hooks/useStrategies';
import getDenomInfo from '@utils/getDenomInfo';
import { getStrategyInitialDenom } from './getStrategyInitialDenom';
import { getStrategyResultingDenom } from './getStrategyResultingDenom';
import { isStrategyScheduled } from './getStrategyStatus';

export function getStrategyStartDate(strategy: Strategy) {
  const { trigger } = strategy;
  if (trigger && 'fin_limit_order' in trigger) {
    // when receive denom hits price send demon
    const initialDenom = getStrategyInitialDenom(strategy);
    const resultingDenom = getStrategyResultingDenom(strategy);
    return `When ${getDenomInfo(resultingDenom).name} hits ${trigger.fin_limit_order.target_price} ${
      getDenomInfo(initialDenom).name
    }`;
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
