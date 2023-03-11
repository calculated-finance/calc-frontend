import getDenomInfo from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';

export function getTotalReceived(strategy: Strategy) {
  const { conversion } = getDenomInfo(strategy.received_amount.denom);

  return parseFloat(conversion(Number(strategy.received_amount.amount)).toFixed(6));
}
