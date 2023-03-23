import getDenomInfo, { convertDenomFromCoin, getDenomMinimumSwapAmount } from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import { Event } from 'src/interfaces/generated/response/get_events_by_resource_id';
import totalExecutions from '@utils/totalExecutions';

import { FIN_TAKER_FEE, SWAP_FEE } from 'src/constants';
import { formatDate } from '@helpers/format/formatDate';
import { getEndDateFromRemainingExecutions } from '@helpers/getEndDateFromRemainingExecutions';
import { getLastExecutionDateFromStrategyEvents } from '@helpers/getLastExecutionDateFromStrategyEvents';
import { getModelFromId } from '@helpers/ml/getModel';
import { getSwapRangeFromModel } from '@helpers/ml/getSwapRange';
import getStrategyBalance, {
  getSwapAmount,
  isStrategyOperating,
  getTotalReceived,
  getConvertedSwapAmount,
  getStrategyInitialDenom,
} from '@helpers/strategy';
import { DcaPlusPerformanceResponse } from 'src/interfaces/generated/response/get_dca_plus_performance';

function getDcaPlusConfig(strategy: Strategy) {
  const { dca_plus_config } = strategy;

  return dca_plus_config;
}

export function getStandardDcaTotalReceived(strategy: Strategy) {
  const { standard_dca_received_amount } = getDcaPlusConfig(strategy) || {};

  return convertDenomFromCoin(standard_dca_received_amount);
}

export function getStandardDcaTotalSwapped(strategy: Strategy) {
  const { standard_dca_swapped_amount } = getDcaPlusConfig(strategy) || {};

  return convertDenomFromCoin(standard_dca_swapped_amount);
}

export function getStandardDcaTotalCost(strategy: Strategy) {
  return Number((getStandardDcaTotalSwapped(strategy) * (1 - FIN_TAKER_FEE - SWAP_FEE)).toFixed(6));
}

export function getStandardDcaTotalDeposit(strategy: Strategy) {
  const { total_deposit } = getDcaPlusConfig(strategy) || {};

  return convertDenomFromCoin(total_deposit);
}

// find the average price of the standard dca using above functions
export function getStandardDcaAveragePrice(strategy: Strategy) {
  const totalReceived = getStandardDcaTotalReceived(strategy);
  const totalCost = getStandardDcaTotalCost(strategy);

  return totalCost / totalReceived;
}

export function getStandardDcaRemainingExecutions(strategy: Strategy) {
  const swappedDifference = getStandardDcaTotalSwapped(strategy) - Number(strategy.swapped_amount.amount);
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

  return convertDenomFromCoin(escrowed_balance);
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

  return Math.floor(Number(standard_dca_swapped_amount?.amount) / swapAmount);
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

export function getPerformanceFactor(performance: DcaPlusPerformanceResponse | undefined) {
  const factor = Number(performance?.factor || 0);
  const rounded = Number(factor.toFixed(4));
  const difference = rounded - 1;
  return difference;
}

function getDcaPlusFee(performance: DcaPlusPerformanceResponse | undefined) {
  const { fee } = performance || {};
  return convertDenomFromCoin(fee);
}

export function getReturnedEscrowAmount(strategy: Strategy, performance: DcaPlusPerformanceResponse | undefined) {
  return getEscrowAmount(strategy) - getDcaPlusFee(performance);
}

export function getDaysRemainingForEscrowReturn(strategy: Strategy) {
  const remainingStandardDCABalance = getStandardDcaTotalDeposit(strategy) - getStandardDcaTotalSwapped(strategy);
  const remainingVaultBalance = convertDenomFromCoin(strategy.balance);

  const largestRemainingBalance = Math.max(remainingStandardDCABalance, remainingVaultBalance);

  return Math.ceil(largestRemainingBalance / getConvertedSwapAmount(strategy));
}
