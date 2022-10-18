import { Strategy } from '@hooks/useStrategies';

export function getStrategyType(strategy: Strategy) {
  const { position_type } = strategy;
  return position_type === 'enter' ? 'DCA In' : 'DCA Out';
}
