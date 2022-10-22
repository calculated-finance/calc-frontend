import { Strategy } from '@hooks/useStrategies';
import totalExecutions from '@utils/totalExecutions';
import getStrategyBalance from './getStrategyBalance';
import getSwapAmount from './getSwapAmount';

export function getStrategyTotalExecutions(strategy: Strategy) {
  const balance = getStrategyBalance(strategy);
  const swapAmount = getSwapAmount(strategy);

  return totalExecutions(balance, swapAmount);
}
