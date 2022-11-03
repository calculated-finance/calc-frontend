import { Strategy } from '@hooks/useStrategies';
import getDenomInfo from '@utils/getDenomInfo';
import { capitalize } from 'lodash';
import { getStrategyInitialDenom } from './getStrategyInitialDenom';
import { getStrategyResultingDenom } from './getStrategyResultingDenom';

export function getStrategyName(strategy: Strategy) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  return `${getDenomInfo(initialDenom).name} to ${getDenomInfo(resultingDenom).name} - ${capitalize(
    strategy.time_interval,
  )}`;
}
