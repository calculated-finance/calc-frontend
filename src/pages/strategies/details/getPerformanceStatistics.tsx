import { DenomValue } from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import { getStrategyInitialDenom } from 'src/helpers/getStrategyInitialDenom';
import { StrategyEvent } from '@hooks/useStrategyEvents';
import { getCompletedEvents } from 'src/pages/strategies/details/getChartData';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';

function getStrategyTotalFeesPaid(strategyEvents: StrategyEvent[]) {
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

export function getPerformanceStatistics(
  strategy: Strategy,
  initialDenomPrice: number,
  resultingDenomPrice: number,
  strategyEvents: StrategyEvent[],
) {
  const marketValueAmount = strategy.received_amount.amount;
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const costAmount = strategy.swapped_amount.amount;
  const totalFeesPaid = getStrategyTotalFeesPaid(strategyEvents);
  const costAmountWithFeesSubtractedInFiat = 
    Number(costAmount) - new DenomValue({amount: totalFeesPaid.toString(), denom: resultingDenom}).toConverted()

  const marketValueValue = new DenomValue({ amount: marketValueAmount, denom: resultingDenom });
  const costValue = new DenomValue({ amount: costAmountWithFeesSubtractedInFiat.toString(), denom: initialDenom });

  const costInFiat = Number((costValue.toConverted() * initialDenomPrice).toFixed(2));
  const marketValueInFiat = Number((marketValueValue.toConverted() * resultingDenomPrice).toFixed(2));

  const profit = marketValueInFiat - costInFiat;

  const percentageChange = `${(costInFiat ? (profit / costInFiat) * 100 : 0).toFixed(2)}%`;

  const color = profit > 0 ? 'green.200' : profit < 0 ? 'red.200' : 'white';
  return {
    color,
    percentageChange,
    marketValueValue,
    marketValueInFiat,
    costValue,
    profit,
  };
}
