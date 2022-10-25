import { Strategy } from '@hooks/useStrategies';

export default function getStrategyBalance(strategy: Strategy) {
  const { balance } = strategy || {};

  return Number(balance.amount);
}
