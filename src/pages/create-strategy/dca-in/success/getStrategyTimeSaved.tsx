import { Strategy } from '@hooks/useStrategies';
import { getStrategyTotalExecutions } from './getStrategyTotalExecutions';

const TIME_SAVED_PER_SWAP = 10;

export function getStrategyTimeSaved(strategy: Strategy) {
  return getStrategyTotalExecutions(strategy) * TIME_SAVED_PER_SWAP;
}
