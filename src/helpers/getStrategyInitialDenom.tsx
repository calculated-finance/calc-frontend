import { Strategy } from '@hooks/useStrategies';
import { Denom } from '@models/Denom';

export function getStrategyInitialDenom(strategy: Strategy): Denom {
  return strategy.balance.denom;
}
