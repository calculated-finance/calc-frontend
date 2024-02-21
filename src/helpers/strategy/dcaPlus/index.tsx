import { fromAtomic } from '@utils/getDenomInfo';
import { Strategy } from '@models/Strategy';
import totalExecutions from '@utils/totalExecutions';

import { SWAP_FEE } from 'src/constants';
import { getModelFromId } from '@helpers/ml/getModel';
import { getSwapRangeFromModel } from '@helpers/ml/getSwapRange';
import {
  getStrategyBalance,
  getTotalReceived,
  getConvertedSwapAmount,
  getStrategyInitialDenom,
  getTotalSwapped,
  getStrategyEndDateFromRemainingExecutions,
  isBuyStrategy,
} from '@helpers/strategy';
import { StrategyEvent } from '@models/StrategyEvent';
import { DcaPlusPerformanceResponse } from '@hooks/useDcaPlusPerformance';
import { findLast, isNil } from 'lodash';
import { getEndDateFromRemainingExecutions } from '@helpers/getEndDateFromRemainingExecutions';
import { getDcaPlusConfig, isDcaPlus } from '../isDcaPlus';
import { getWeightedScaleConfig, isWeightedScale } from '../isWeightedScale';

export function getStandardDcaTotalReceived(strategy: Strategy) {
  const { standard_dca_received_amount } = getDcaPlusConfig(strategy) || {};

  return Number(
    fromAtomic(strategy.resultingDenom, Number(standard_dca_received_amount?.amount)).toFixed(
      strategy.resultingDenom.significantFigures,
    ),
  );
}

export function getStandardDcaTotalSwapped(strategy: Strategy) {
  const { standard_dca_swapped_amount } = getDcaPlusConfig(strategy) || {};

  return Number(
    fromAtomic(strategy.initialDenom, Number(standard_dca_swapped_amount?.amount)).toFixed(
      strategy.initialDenom.significantFigures,
    ),
  );
}

export function getStandardDcaTotalCost(strategy: Strategy, dexFee: number) {
  return Number((getStandardDcaTotalSwapped(strategy) * (1 - dexFee - SWAP_FEE)).toFixed(6));
}

export function getStandardDcaTotalDeposit(strategy: Strategy) {
  const { total_deposit } = getDcaPlusConfig(strategy) || {};

  return Number(
    fromAtomic(strategy.initialDenom, Number(total_deposit?.amount)).toFixed(strategy.initialDenom.significantFigures),
  );
}

export function getStandardDcaTotalReceivedBeforeFees(strategy: Strategy, dexFee: number) {
  const feeFactor = SWAP_FEE + dexFee;
  return getStandardDcaTotalReceived(strategy) / (1 - feeFactor);
}

export function getStandardDcaAveragePurchasePrice(strategy: Strategy, dexFee: number) {
  return getStandardDcaTotalSwapped(strategy) / getStandardDcaTotalReceivedBeforeFees(strategy, dexFee);
}

export function getStandardDcaAverageSellPrice(strategy: Strategy, dexFee: number) {
  return getStandardDcaTotalReceivedBeforeFees(strategy, dexFee) / getStandardDcaTotalSwapped(strategy);
}

export function getEscrowLevel(strategy: Strategy) {
  const { escrow_level } = getDcaPlusConfig(strategy) || {};

  return Number(escrow_level);
}

export function getEscrowAmount(strategy: Strategy) {
  const { escrowed_balance } = getDcaPlusConfig(strategy) || {};

  return Number(
    fromAtomic(strategy.resultingDenom, Number(escrowed_balance?.amount)).toFixed(
      strategy.resultingDenom.significantFigures,
    ),
  );
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
  if (isDcaPlus(strategy)) {
    const swapAmount = getConvertedSwapAmount(strategy);
    const model = getStrategyModel(strategy);

    const { minimumSwapAmount } = getStrategyInitialDenom(strategy);
    return getSwapRangeFromModel(swapAmount, model, minimumSwapAmount);
  }
  if (isWeightedScale(strategy)) {
    const { multiplier, increase_only } = getWeightedScaleConfig(strategy) || {};
    const swapAmount = getConvertedSwapAmount(strategy);
    if (isBuyStrategy(strategy)) {
      const max = Number((swapAmount * (1 - 0.5 * Number(multiplier))).toFixed(6));
      const min = Number((swapAmount * (1 + 0.5 * Number(multiplier))).toFixed(6));
      const checkMin = min < 0 ? 0 : min;
      const checkMax = max < 0 ? 0 : max;

      return {
        min: isBuyStrategy(strategy) && !increase_only ? checkMin : swapAmount,
        max: !isBuyStrategy(strategy) && !increase_only ? checkMax : swapAmount,
      };
    }

    const min = Number((swapAmount * (1 - 0.5 * Number(multiplier))).toFixed(6));
    const max = Number((swapAmount * (1 + 0.5 * Number(multiplier))).toFixed(6));
    const checkMin = min < 0 ? 0 : min;
    const checkMax = max < 0 ? 0 : max;

    return {
      min: isBuyStrategy(strategy) && !increase_only ? checkMin : swapAmount,
      max: !isBuyStrategy(strategy) && !increase_only ? checkMax : swapAmount,
    };
  }

  return undefined;
}

export function getPerformanceFactor(performance: DcaPlusPerformanceResponse | undefined) {
  const factor = Number(performance?.factor || 0);
  const rounded = Number(factor.toFixed(4));
  const difference = rounded - 1;
  return difference;
}

function getDcaPlusFee(strategy: Strategy, performance: DcaPlusPerformanceResponse | undefined) {
  const { fee } = performance || {};

  return Number(
    fromAtomic(strategy.resultingDenom, Number(fee?.amount)).toFixed(strategy.resultingDenom.significantFigures),
  );
}

export function getReturnedEscrowAmount(strategy: Strategy, performance: DcaPlusPerformanceResponse | undefined) {
  return getEscrowAmount(strategy) - getDcaPlusFee(strategy, performance);
}

export function getStandardDcaRemainingBalance(strategy: Strategy) {
  return getStandardDcaTotalDeposit(strategy) - getStandardDcaTotalSwapped(strategy);
}

export function getRemainingExecutionsRange(strategy: Strategy) {
  const balance = getStrategyBalance(strategy);
  const { min: minSwap, max: maxSwap } = getStrategySwapRange(strategy) || {};

  if (isBuyStrategy(strategy) && isWeightedScale(strategy)) {
    return {
      min: minSwap && totalExecutions(balance, minSwap),
      max: maxSwap && totalExecutions(balance, maxSwap),
    };
  }

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
