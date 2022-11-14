import { Strategy } from '@hooks/useStrategies';
import getDenomInfo from '@utils/getDenomInfo';
import { getStrategyInitialDenom } from './getStrategyInitialDenom';
import { getStrategyResultingDenom } from './getStrategyResultingDenom';
import { isStrategyScheduled } from './getStrategyStatus';

export function getStrategyStartDate(strategy: Strategy) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (strategy.trigger.fin_limit_order) {
    // when receive denom hits price send demon
    const initialDenom = getStrategyInitialDenom(strategy)
    const resultingDenom = getStrategyResultingDenom(strategy)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return `When ${getDenomInfo(resultingDenom).name} hits ${strategy.trigger.fin_limit_order.target_price} ${getDenomInfo(initialDenom).name}`
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (isStrategyScheduled(strategy) && strategy?.trigger?.time?.target_time) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new Date(Number(strategy.trigger.time.target_time) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return strategy.started_at
    ? new Date(Number(strategy.started_at) / 1000000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '-';
}
