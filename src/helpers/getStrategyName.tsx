import { Strategy } from '@hooks/useStrategies';
import getDenomInfo from '@utils/getDenomInfo';
import { capitalize } from 'lodash';
import { getInitialDenom } from './getInitialDenom';
import { getResultingDenom } from './getResultingDenom';

export function getStrategyName(strategy: Strategy) {
  const initialDenom = getInitialDenom(strategy.position_type, strategy.pair)
  const resultingDenom = getResultingDenom(strategy.position_type, strategy.pair)

  return `${getDenomInfo(initialDenom).name} to ${getDenomInfo(resultingDenom).name} - ${capitalize(strategy.time_interval)}`
}
