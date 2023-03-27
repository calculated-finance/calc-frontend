import { convertDenomFromCoin, getDenomMinimumSwapAmount } from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import totalExecutions from '@utils/totalExecutions';

import { FIN_TAKER_FEE, SWAP_FEE } from 'src/constants';
import { getModelFromId } from '@helpers/ml/getModel';
import { getSwapRangeFromModel } from '@helpers/ml/getSwapRange';
import getStrategyBalance, {
  getTotalReceived,
  getConvertedSwapAmount,
  getStrategyInitialDenom,
  getTotalSwapped,
  getStrategyEndDateFromRemainingExecutions,
} from '@helpers/strategy';
import { DcaPlusPerformanceResponse } from 'src/interfaces/generated/response/get_dca_plus_performance';
import { StrategyEvent } from '@hooks/useStrategyEvents';
import { findLast, isNil } from 'lodash';
import { getEndDateFromRemainingExecutions } from '@helpers/getEndDateFromRemainingExecutions';

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
export function getStandardDcaAverageCost(strategy: Strategy) {
  return getStandardDcaTotalSwapped(strategy) / getStandardDcaTotalReceived(strategy);
}

export function getStandardDcaAveragePrice(strategy: Strategy) {
  return getStandardDcaTotalReceived(strategy) / getStandardDcaTotalSwapped(strategy);
}

export function getEscrowLevel(strategy: Strategy) {
  const { escrow_level } = getDcaPlusConfig(strategy) || {};

  return Number(escrow_level);
}

export function getEscrowAmount(strategy: Strategy) {
  const { escrowed_balance } = getDcaPlusConfig(strategy) || {};

  return convertDenomFromCoin(escrowed_balance);
}

export function getAccumulationGained(strategy: Strategy) {
  const standardDcaTotalReceived = getStandardDcaTotalReceived(strategy);
  const totalReceived = getTotalReceived(strategy);

  const difference = totalReceived - standardDcaTotalReceived;

  return Number(difference.toFixed(6));
}

export function getSwappedSaved(strategy: Strategy) {
  const standardDcaTotalSwapped = getStandardDcaTotalSwapped(strategy);
  const totalSwapped = getTotalSwapped(strategy);

  const difference = standardDcaTotalSwapped - totalSwapped;
  return Number(difference.toFixed(6));
}

export function getNumberOfPastSwaps(strategy: Strategy) {
  const totalSwapped = getStandardDcaTotalSwapped(strategy);
  const swapAmount = getConvertedSwapAmount(strategy);

  return Math.floor(totalSwapped / swapAmount);
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

export function getStandardDcaRemainingBalance(strategy: Strategy) {
  return getStandardDcaTotalDeposit(strategy) - getStandardDcaTotalSwapped(strategy);
}

export function getRemainingExecutionsRange(strategy: Strategy) {
  const model = getStrategyModel(strategy);
  const swapAmount = getConvertedSwapAmount(strategy);
  const minimumSwapAmount = getDenomMinimumSwapAmount(getStrategyInitialDenom(strategy));
  const balance = getStrategyBalance(strategy);
  const { min: minSwap, max: maxSwap } = getSwapRangeFromModel(swapAmount, model, minimumSwapAmount) || {};
  return {
    min: maxSwap && totalExecutions(balance, maxSwap),
    max: minSwap && totalExecutions(balance, minSwap),
  };
}

export function getStandardDcaRemainingExecutions(strategy: Strategy) {
  const balance = getStandardDcaRemainingBalance(strategy);
  const swapAmount = getConvertedSwapAmount(strategy);

  return totalExecutions(balance, swapAmount);
}

export function isEscrowPending(strategy: Strategy) {
  return getStrategyBalance(strategy) === 0 && getEscrowAmount(strategy) > 0;
}

export function getLastExecutionDateFromStrategyEvents(events: StrategyEvent[] | undefined) {
  const lastExecutionEvent = findLast(events, (event: StrategyEvent) => {
    const { data } = event;
    if ('simulated_dca_vault_execution_completed' in data) {
      return data.simulated_dca_vault_execution_completed;
    }
    return false;
  }) as StrategyEvent;

  // vault has no executions yet
  if (!lastExecutionEvent) {
    return undefined;
  }

  return new Date(Number(lastExecutionEvent.timestamp) / 1000000);
}

export function getStandardDcaEndDate(strategy: Strategy, strategyEvents: StrategyEvent[] | undefined) {
  const remainingExecutions = getStandardDcaRemainingExecutions(strategy);
  const lastExecutionEvent = getLastExecutionDateFromStrategyEvents(strategyEvents);
  if (!lastExecutionEvent) {
    return undefined;
  }
  return getEndDateFromRemainingExecutions(strategy, lastExecutionEvent, remainingExecutions);
}

export function getStrategyEndDateRange(strategy: Strategy, strategyEvents: StrategyEvent[] | undefined) {
  const { min, max } = getRemainingExecutionsRange(strategy) || {};

  return {
    min: !isNil(min) && getStrategyEndDateFromRemainingExecutions(strategy, strategyEvents, min),
    max: !isNil(max) && getStrategyEndDateFromRemainingExecutions(strategy, strategyEvents, max),
  };
}
