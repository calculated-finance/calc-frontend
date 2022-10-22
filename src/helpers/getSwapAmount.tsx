import { Strategy } from '@hooks/useStrategies';

export default function getSwapAmount(strategy: Strategy) {
  const { swap_amount } = strategy || {};
  return Number(swap_amount);
}
