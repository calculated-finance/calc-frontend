import { Strategy } from '@hooks/useStrategies';

export function getStrategyStartDate(strategy: Strategy) {
  return new Date(Number(strategy.started_at) / 1000000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
