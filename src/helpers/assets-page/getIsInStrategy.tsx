import { StrategyTypes } from '@models/StrategyTypes';

export function getIsInStrategy(strategyType: string | undefined) {
  const strategy = strategyType && strategyType;
  return [StrategyTypes.DCAIn, StrategyTypes.DCAPlusIn, StrategyTypes.WeightedScaleIn].includes(
    strategy as StrategyTypes,
  );
}
