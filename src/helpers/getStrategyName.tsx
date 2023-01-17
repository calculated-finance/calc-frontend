import { Strategy } from '@hooks/useStrategies';
import getDenomInfo from '@utils/getDenomInfo';
import { capitalize } from 'lodash';
import { executionIntervalLabel } from './executionIntervalDisplay';
import { getStrategyInitialDenom } from './getStrategyInitialDenom';
import { getStrategyResultingDenom } from './getStrategyResultingDenom';

export function getStrategyName(strategy: Strategy) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  return `${getDenomInfo(initialDenom).name} to ${getDenomInfo(resultingDenom).name} - ${
    executionIntervalLabel[strategy.time_interval]
  }`;
}
