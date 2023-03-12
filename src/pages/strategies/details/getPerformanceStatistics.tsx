import { DenomValue } from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import { StrategyEvent } from '@hooks/useStrategyEvents';
import { getStrategyInitialDenom, getStrategyResultingDenom, getStrategyTotalFeesPaid } from 'src/helpers/strategy';

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
  const costAmountWithFeesSubtractedInFiat = Number(costAmount) - totalFeesPaid;

  const marketValueValue = new DenomValue({ amount: marketValueAmount, denom: resultingDenom });
  const costValue = new DenomValue({ amount: costAmountWithFeesSubtractedInFiat.toString(), denom: initialDenom });

  const costInFiat = Number((costValue.toConverted() * initialDenomPrice).toFixed(2));
  const marketValueInFiat = Number((marketValueValue.toConverted() * resultingDenomPrice).toFixed(2));

  const profit = marketValueInFiat - costInFiat;

  const percentageChange = `${(costInFiat ? (profit / costInFiat) * 100 : 0).toFixed(2)}%`;

  let color;
  if (profit > 0) {
    color = 'green.200';
  } else if (parseFloat(percentageChange) < 0 && parseFloat(percentageChange) > -1) {
    color = 'white.200';
  } else if (profit < 0) {
    color = 'red.200';
  } else {
    color = 'white';
  }

  return {
    color,
    percentageChange,
    marketValueValue,
    marketValueInFiat,
    costValue,
    profit,
  };
}
