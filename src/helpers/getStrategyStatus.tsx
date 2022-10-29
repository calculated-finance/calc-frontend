import { Strategy } from '@hooks/useStrategies';

export function getStrategyStatus(strategy: Strategy) {
  if (strategy.status === 'inactive') {
    return 'completed';
  }
  return strategy.status;
}

export function isStrategyOperating(strategy: Strategy) {
  return ['active', 'scheduled'].includes(strategy.status);
}
