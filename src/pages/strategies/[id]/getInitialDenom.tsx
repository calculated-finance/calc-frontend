import { PositionType, Strategy } from '@hooks/useStrategies';
import { Denom, Pair } from '@hooks/usePairs';
import DenomAmount from '@models/DenomAmount';
import getDenomInfo from '@utils/getDenomInfo';

export function getInitialDenom(positionType?: PositionType, pair?: Pair) {
  return positionType === 'enter' ? pair?.quote_denom : pair?.base_denom;
}

export function getStrategyInitialDenom(strategy: Strategy): Denom {
  const { status, configuration, balances } = strategy;
  const { position_type, execution_interval, swap_amount, pair } = configuration || {};
  return position_type === 'enter' ? pair?.quote_denom : pair?.base_denom;
}

export function getDenomName(denom: Denom): string {
  const { name } = getDenomInfo(denom);
  return name;
}
