import { Strategy } from '@hooks/useStrategies';
import { Denom } from '@models/Denom';
import { getStrategyInitialDenom } from './getStrategyInitialDenom';


export function getStrategyResultingDenom(strategy: Strategy): Denom {
  const initialDenom = getStrategyInitialDenom(strategy);
  if (strategy.pair.quote_denom === initialDenom) {
    return strategy.pair.base_denom;
  }

  return strategy.pair.quote_denom;
}
