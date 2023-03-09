import { Strategy } from '@hooks/useStrategies';

export function isDcaPlus(strategy: Strategy) {
  return Boolean(strategy.dca_plus_config);
}
