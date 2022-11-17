import { DenomValue } from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import { getStrategyInitialDenom } from 'src/helpers/getStrategyInitialDenom';
import { DELEGATION_FEE, FIN_TAKER_FEE, SWAP_FEE } from 'src/constants';
import { isAutoStaking } from 'src/helpers/isAutoStaking';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';

export function getPerformanceStatistics(strategy: Strategy, initialDenomPrice: number, resultingDenomPrice: number) {
  const marketValueAmount = strategy.received_amount.amount;
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const isAutostaking = isAutoStaking(strategy.destinations);

  const costAmount = strategy.swapped_amount.amount;
  const feeFactor = SWAP_FEE + FIN_TAKER_FEE + (isAutostaking ? DELEGATION_FEE : 0);
  const costAmountWithFeesSubtractedInFiat = Number(costAmount) - Number(costAmount) * feeFactor;

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
