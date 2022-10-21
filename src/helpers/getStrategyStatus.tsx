import { Strategy } from '@hooks/useStrategies';

export function getStrategyStatus(strategy: Strategy) {
  if (strategy.status === 'inactive') {
    return 'completed';
  }
  if (strategy.status === 'active') {
    if (!strategy.started_at) {
      return 'scheduled';
    }
    return 'active';
  }
  return strategy.status;
}
