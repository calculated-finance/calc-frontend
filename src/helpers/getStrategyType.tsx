import { Strategy } from '@hooks/useStrategies';
import { StrategyTypes } from '@models/StrategyTypes';
import { isDenomStable } from '@utils/getDenomInfo';
import { getStrategyInitialDenom } from "./getStrategyInitialDenom";

export function getStrategyType(strategy: Strategy) {
  return isDenomStable(getStrategyInitialDenom(strategy)) ? StrategyTypes.DCAIn : StrategyTypes.DCAOut;
}
