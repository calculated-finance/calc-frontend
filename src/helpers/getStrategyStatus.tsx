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

export function isStrategyCompleted(strategy: Strategy) {
  return ['inactive'].includes(strategy.status);
}

export function isStrategyCancelled(strategy: Strategy) {
  return ['cancelled'].includes(strategy.status);
}
