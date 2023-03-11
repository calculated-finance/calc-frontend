import { Strategy } from '@hooks/useStrategies';
import { getStrategyInitialDenom } from 'src/helpers/getStrategyInitialDenom';
import { StrategyEvent } from '@hooks/useStrategyEvents';
import getDenomInfo from '@utils/getDenomInfo';
import { getCompletedEvents } from './getCompletedEvents';

export function getStrategyTotalFeesPaid(strategyEvents: StrategyEvent[]) {
  const completedEvents = getCompletedEvents(strategyEvents) || [];
  return (
    completedEvents.reduce((acc, { data }) => {
      if ('dca_vault_execution_completed' in data) {
        return acc + Number(data.dca_vault_execution_completed.fee.amount);
      }
      return 0;
    }, 0) || 0
  );
}

export function getTotalCost(strategy: Strategy, events: StrategyEvent[]) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const costAmount = strategy.swapped_amount.amount;
  const totalFeesPaid = getStrategyTotalFeesPaid(events);
  const costAmountWithFeesSubtracted = Number(costAmount) - totalFeesPaid;

  const { conversion } = getDenomInfo(initialDenom);

  return conversion(costAmountWithFeesSubtracted);
}
