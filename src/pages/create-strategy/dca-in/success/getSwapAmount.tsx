import { Strategy } from '@hooks/useStrategies';

export default function getSwapAmount(strategy: Strategy) {
  const { configuration } = strategy || {};
  const { swap_amount } = configuration || {};
  return Number(swap_amount);
}
