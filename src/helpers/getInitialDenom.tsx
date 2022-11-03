import { PositionType, Strategy } from '@hooks/useStrategies';
import { Pair } from '@models/Pair';
import { Denom } from '@models/Denom';
import getDenomInfo from '@utils/getDenomInfo';

export function getInitialDenom(positionType?: PositionType, pair?: Pair) {
  return positionType === 'enter' ? pair?.quote_denom : pair?.base_denom;
}

export function getStrategyInitialDenom(strategy: Strategy): Denom {
  const { pair, position_type } = strategy;
  return position_type === 'enter' ? pair?.quote_denom : pair?.base_denom;
}

export function getStrategyResultingDenom(strategy: Strategy): Denom {
  const { pair, position_type } = strategy;
  return position_type === 'enter' ? pair?.base_denom : pair?.quote_denom;
}

export function getDenomName(denom: Denom): string {
  const { name } = getDenomInfo(denom);
  return name;
}
