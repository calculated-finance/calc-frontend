import { Strategy } from '@hooks/useStrategies';
import { StrategyTypes } from '@models/StrategyTypes';
import { isDenomStable } from '@utils/getDenomInfo';
import { getStrategyInitialDenom } from './getStrategyInitialDenom';
import { isDcaPlus } from './strategy/isDcaPlus';

export function getStrategyType(strategy: Strategy) {
  const initialDenom = getStrategyInitialDenom(strategy);

  if (isDcaPlus(strategy)) {
    return isDenomStable(initialDenom) ? StrategyTypes.DCAPlusIn : StrategyTypes.DCAPlusOut;
  }

  return isDenomStable(initialDenom) ? StrategyTypes.DCAIn : StrategyTypes.DCAOut;
}
