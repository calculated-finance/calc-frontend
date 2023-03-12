import getDenomInfo from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import { Event } from 'src/interfaces/generated/response/get_events_by_resource_id';
import getStrategyBalance from 'src/helpers/getStrategyBalance';
import getSwapAmount from 'src/helpers/getSwapAmount';
import totalExecutions from '@utils/totalExecutions';
import { getLastExecutionDateFromStrategyEvents } from 'src/helpers/getLastExecutionDateFromStrategyEvents';
import { isStrategyOperating } from 'src/helpers/getStrategyStatus';
import { getEndDateFromRemainingExecutions } from 'src/helpers/getEndDateFromRemainingExecutions';
import { formatDate } from 'src/helpers/format/formatDate';
import { getTotalReceived } from '../getTotalReceived';

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

// getAcculumationDifference
export function getAcculumationDifference(strategy: Strategy) {
  // get the total received from the standard dca
  const standardDcaTotalReceived = getStandardDcaTotalReceived(strategy);

  // get the total received from the strategy
  const totalReceived = getTotalReceived(strategy);

  // get the difference between the two
  const difference = totalReceived - standardDcaTotalReceived;

  return difference;
}

// number of swaps so far
export function getNumberOfSwaps(strategy: Strategy) {
  // get total cost of standard dca
  const { standard_dca_swapped_amount } = getDcaPlusConfig(strategy) || {};

  // use swap amount to calculate number of swaps
  const swapAmount = getSwapAmount(strategy);

  return Math.floor(Number(standard_dca_swapped_amount) / swapAmount);
}
