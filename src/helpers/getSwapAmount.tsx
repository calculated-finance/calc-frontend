import { Strategy } from '@hooks/useStrategies';
import getDenomInfo from '@utils/getDenomInfo';

export default function getSwapAmount(strategy: Strategy) {
  const { swap_amount } = strategy || {};
  return Number(swap_amount);
}

export function getConvertedSwapAmount(strategy: Strategy) {
  const { conversion } = getDenomInfo(strategy.swapped_amount.denom);
  return Number(conversion(getSwapAmount(strategy)).toFixed(6));
}
