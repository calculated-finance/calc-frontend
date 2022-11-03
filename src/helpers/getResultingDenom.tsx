import { PositionType } from '@hooks/useStrategies';
import { Pair } from '@models/Pair';

export function getResultingDenom(positionType?: PositionType, pair?: Pair) {
  return positionType === 'enter' ? pair?.base_denom : pair?.quote_denom;
}
