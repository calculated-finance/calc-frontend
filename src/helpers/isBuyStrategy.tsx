import { Strategy } from '@hooks/useStrategies';
import { StrategyTypes } from '@models/StrategyTypes';
import { getStrategyType } from './getStrategyType';

export function isBuyStrategy(strategy: Strategy) {
  return getStrategyType(strategy) === StrategyTypes.DCAIn || getStrategyType(strategy) === StrategyTypes.DCAPlusIn;
}
