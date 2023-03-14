import getDenomInfo, { getDenomMinimumSwapAmount } from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import { Event } from 'src/interfaces/generated/response/get_events_by_resource_id';
import totalExecutions from '@utils/totalExecutions';
import { getLastExecutionDateFromStrategyEvents } from '@helpers/getLastExecutionDateFromStrategyEvents';
import { getEndDateFromRemainingExecutions } from '@helpers/getEndDateFromRemainingExecutions';
import { formatDate } from '@helpers/format/formatDate';
import { getSwapRangeFromModel } from '@helpers/ml/getSwapRange';
import { getModelFromId } from '@helpers/ml/getModel';
import getStrategyBalance, {
  getSwapAmount,
  isStrategyOperating,
  getTotalReceived,
  getConvertedSwapAmount,
  getStrategyInitialDenom,
} from '..';

function getDcaPlusConfig(strategy: Strategy) {
  const { dca_plus_config } = strategy;

  return dca_plus_config;
}

export function getStandardDcaTotalReceived(strategy: Strategy) {
  const { conversion } = getDenomInfo(strategy.received_amount.denom);

  const { standard_dca_received_amount } = getDcaPlusConfig(strategy) || {};

  return parseFloat(conversion(Number(standard_dca_received_amount)).toFixed(6));
}

export function getStandardDcaTotalCost(strategy: Strategy) {
  const { conversion } = getDenomInfo(strategy.swapped_amount.denom);

  const { standard_dca_swapped_amount } = getDcaPlusConfig(strategy) || {};

  return parseFloat(conversion(Number(standard_dca_swapped_amount)).toFixed(6));
}

// find the average price of the standard dca using above functions
export function getStandardDcaAveragePrice(strategy: Strategy) {
  const totalReceived = getStandardDcaTotalReceived(strategy);
  const totalCost = getStandardDcaTotalCost(strategy);

  return totalReceived / totalCost;
}

export function getStandardDcaRemainingExecutions(strategy: Strategy) {
  const swappedDifference = getStandardDcaTotalCost(strategy) - Number(strategy.swapped_amount.amount);
  const balance = getStrategyBalance(strategy) + swappedDifference;
  const swapAmount = getSwapAmount(strategy);

  return totalExecutions(balance, swapAmount);
}

export function getStandardDcaStrategyEndDate(strategy: Strategy, events: Event[]) {
  const executions = getStandardDcaRemainingExecutions(strategy);

  const lastExecutionDate = getLastExecutionDateFromStrategyEvents(events);

  if (isStrategyOperating(strategy) && lastExecutionDate) {
    return formatDate(getEndDateFromRemainingExecutions(strategy, lastExecutionDate, executions));
  }

  return '-';
}

export function getEscrowLevel(strategy: Strategy) {
  const { escrow_level } = getDcaPlusConfig(strategy) || {};

  return Number(escrow_level);
}

export function getEscrowAmount(strategy: Strategy) {
  const { escrowed_balance } = getDcaPlusConfig(strategy) || {};

  // convert to the initial denom
  const { conversion } = getDenomInfo(getStrategyInitialDenom(strategy));

  return Number(conversion(Number(escrowed_balance)).toFixed(6));
}

export function getAcculumationDifference(strategy: Strategy) {
  const standardDcaTotalReceived = getStandardDcaTotalReceived(strategy);
  const totalReceived = getTotalReceived(strategy);

  const difference = totalReceived - standardDcaTotalReceived;

  return Number(difference.toFixed(6));
}

export function getNumberOfPastSwaps(strategy: Strategy) {
  const { standard_dca_swapped_amount } = getDcaPlusConfig(strategy) || {};

  const swapAmount = getSwapAmount(strategy);

  return Math.floor(Number(standard_dca_swapped_amount) / swapAmount);
}

export function getStrategyModel(strategy: Strategy) {
  const { model_id } = getDcaPlusConfig(strategy) || {};

  return getModelFromId(model_id);
}

export function getStrategySwapRange(strategy: Strategy) {
  const swapAmount = getConvertedSwapAmount(strategy);
  const model = getStrategyModel(strategy);

  const minimumSwapAmount = getDenomMinimumSwapAmount(getStrategyInitialDenom(strategy));
  return getSwapRangeFromModel(swapAmount, model, minimumSwapAmount);
}
