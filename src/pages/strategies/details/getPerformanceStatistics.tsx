import { Strategy } from '@hooks/useStrategies';
import { getTotalReceived, getTotalReceivedBeforeFees, getTotalSwapped } from '@helpers/strategy';

export function getPerformanceStatistics(
  strategy: Strategy,
  initialDenomPrice: number,
  resultingDenomPrice: number,
  dexFee: number,
) {
  const costInFiat = Number((getTotalSwapped(strategy) * initialDenomPrice).toFixed(2));
  const marketValueInFiat = Number((getTotalReceived(strategy) * resultingDenomPrice).toFixed(2));
  const marketValueBeforeFeesInFiat = Number(
    (getTotalReceivedBeforeFees(strategy, dexFee) * resultingDenomPrice).toFixed(2),
  );

  const profit = marketValueBeforeFeesInFiat - costInFiat;

  const percentageChange = `${(costInFiat ? (profit / costInFiat) * 100 : 0).toFixed(2)}%`;

  let color;
  if (profit > 0) {
    color = 'green.200';
  } else if (parseFloat(percentageChange) < 0 && parseFloat(percentageChange) > -2) {
    color = 'white.200';
  } else if (profit < 0) {
    color = 'red.200';
  } else {
    color = 'white';
  }

  return {
    color,
    percentageChange,
    marketValueInFiat,
    profit,
  };
}
