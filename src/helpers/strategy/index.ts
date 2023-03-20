import { Strategy } from '@hooks/useStrategies';
import { StrategyEvent } from '@hooks/useStrategyEvents';
import { Denom } from '@models/Denom';
import { StrategyTypes } from '@models/StrategyTypes';
import getDenomInfo, { convertDenomFromCoin, isDenomStable } from '@utils/getDenomInfo';
import totalExecutions from '@utils/totalExecutions';
import { DELEGATION_FEE, FIN_TAKER_FEE, SWAP_FEE } from 'src/constants';
import { Vault } from 'src/interfaces/generated/response/get_vaults_by_address';
import { executionIntervalLabel } from '../executionIntervalDisplay';
import { formatDate } from '../format/formatDate';
import { getEndDateFromRemainingExecutions } from '../getEndDateFromRemainingExecutions';
import { getLastExecutionDateFromStrategyEvents } from '../getLastExecutionDateFromStrategyEvents';
import { isAutoStaking } from '../isAutoStaking';

export function isDcaPlus(strategy: Strategy) {
  return Boolean(strategy.dca_plus_config);
}

export function getStrategyStatus(strategy: Strategy) {
  if (strategy.status === 'inactive') {
    return 'completed';
  }
  return strategy.status;
}

export function isStrategyOperating(strategy: Strategy) {
  return ['active', 'scheduled'].includes(strategy.status);
}

export function isStrategyActive(strategy: Strategy) {
  return ['active'].includes(strategy.status);
}

export function isStrategyScheduled(strategy: Strategy) {
  return ['scheduled'].includes(strategy.status);
}

export function isStrategyCompleted(strategy: Strategy) {
  return ['inactive'].includes(strategy.status);
}

export function isStrategyCancelled(strategy: Strategy) {
  return ['cancelled'].includes(strategy.status);
}

export default function getStrategyBalance(strategy: Strategy) {
  const { balance } = strategy || {};

  return Number(balance.amount);
}

export function getStrategyInitialDenom(strategy: Strategy): Denom {
  return strategy.balance.denom;
}

export function getStrategyResultingDenom(strategy: Strategy): Denom {
  const initialDenom = getStrategyInitialDenom(strategy);
  if (strategy.pair.quote_denom === initialDenom) {
    return strategy.pair.base_denom;
  }

  return strategy.pair.quote_denom;
}

export function getStrategyName(strategy: Strategy) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  return `${getDenomInfo(initialDenom).name} to ${getDenomInfo(resultingDenom).name} - ${
    executionIntervalLabel[strategy.time_interval]
  }`;
}

export function getSlippageTolerance(strategy: Strategy) {
  return strategy.slippage_tolerance ? `${(parseFloat(strategy.slippage_tolerance) * 100).toFixed(2)}%` : '-';
}

export function getSwapAmount(strategy: Strategy) {
  const { swap_amount } = strategy || {};
  return Number(swap_amount);
}

export function getConvertedSwapAmount(strategy: Strategy) {
  const { conversion } = getDenomInfo(strategy.swapped_amount.denom);
  return Number(conversion(getSwapAmount(strategy)).toFixed(6));
}

export function getStrategyType(strategy: Strategy) {
  const initialDenom = getStrategyInitialDenom(strategy);

  if (isDcaPlus(strategy)) {
    return isDenomStable(initialDenom) ? StrategyTypes.DCAPlusIn : StrategyTypes.DCAPlusOut;
  }

  return isDenomStable(initialDenom) ? StrategyTypes.DCAIn : StrategyTypes.DCAOut;
}

export function getStrategyTotalExecutions(strategy: Strategy) {
  const balance = getStrategyBalance(strategy);
  const swapAmount = getSwapAmount(strategy);

  return totalExecutions(balance, swapAmount);
}

export function isBuyStrategy(strategy: Strategy) {
  return getStrategyType(strategy) === StrategyTypes.DCAIn || getStrategyType(strategy) === StrategyTypes.DCAPlusIn;
}

export function getStrategyStartDate(strategy: Strategy) {
  const { trigger } = strategy;
  if (trigger && 'fin_limit_order' in trigger) {
    const { priceDeconversion } = isBuyStrategy(strategy)
      ? getDenomInfo(getStrategyResultingDenom(strategy))
      : getDenomInfo(getStrategyInitialDenom(strategy));
    const price = Number(priceDeconversion(Number(trigger.fin_limit_order.target_price)).toFixed(3));
    const initialDenom = getStrategyInitialDenom(strategy);
    const resultingDenom = getStrategyResultingDenom(strategy);
    if (isBuyStrategy(strategy)) {
      return `When ${getDenomInfo(resultingDenom).name} hits ${price} ${getDenomInfo(initialDenom).name}`;
    }
    return `When ${getDenomInfo(initialDenom).name} hits ${price} ${getDenomInfo(resultingDenom).name}`;
  }

  if (isStrategyScheduled(strategy) && trigger && 'time' in trigger && trigger.time.target_time) {
    return new Date(Number(trigger.time.target_time) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return strategy.started_at
    ? new Date(Number(strategy.started_at) / 1000000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '-';
}

export function getStrategyEndDate(strategy: Strategy, events: StrategyEvent[] | undefined) {
  const { trigger } = strategy;
  if (trigger && 'fin_limit_order' in trigger) {
    return 'Pending strategy start';
  }

  const executions = getStrategyTotalExecutions(strategy);

  if (isStrategyScheduled(strategy) && trigger && 'time' in trigger) {
    const startDate = new Date(Number(trigger.time.target_time) / 1000000);
    return formatDate(getEndDateFromRemainingExecutions(strategy, startDate, executions));
  }

  if (!events) {
    return '-';
  }

  const lastExecutionDate = getLastExecutionDateFromStrategyEvents(events);

  if (isStrategyOperating(strategy) && lastExecutionDate) {
    return formatDate(getEndDateFromRemainingExecutions(strategy, lastExecutionDate, executions));
  }

  if (lastExecutionDate) {
    return lastExecutionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return '-';
}

export function isStrategyAutoStaking(strategy: Strategy) {
  return isAutoStaking(strategy.destinations);
}

export function getPriceCeilingFloor(strategy: Vault) {
  if (!strategy.minimum_receive_amount) {
    return undefined;
  }

  const { priceDeconversion } = isBuyStrategy(strategy)
    ? getDenomInfo(getStrategyResultingDenom(strategy))
    : getDenomInfo(getStrategyInitialDenom(strategy));

  const price = isBuyStrategy(strategy)
    ? parseFloat(strategy.swap_amount) / parseFloat(strategy.minimum_receive_amount)
    : parseFloat(strategy.minimum_receive_amount) / parseFloat(strategy.swap_amount);

  return Number(priceDeconversion(price).toFixed(3));
}

export function getStrategyTotalFeesPaid(strategy: Strategy) {
  const costAmount = strategy.swapped_amount.amount;
  const feeFactor = SWAP_FEE + FIN_TAKER_FEE + (isStrategyAutoStaking(strategy) ? DELEGATION_FEE : 0);
  return Number(costAmount) * feeFactor;
}

export function getTotalSwapped(strategy: Strategy) {
  return convertDenomFromCoin(strategy.swapped_amount);
}

export function getTotalCost(strategy: Strategy) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const costAmount = strategy.swapped_amount.amount;
  const totalFeesPaid = getStrategyTotalFeesPaid(strategy);
  const costAmountWithFeesSubtracted = Number(costAmount) - totalFeesPaid;

  const { conversion } = getDenomInfo(initialDenom);

  return conversion(costAmountWithFeesSubtracted);
}

export function getTotalReceived(strategy: Strategy) {
  const { conversion } = getDenomInfo(strategy.received_amount.denom);

  return parseFloat(conversion(Number(strategy.received_amount.amount)).toFixed(6));
}

export function getAveragePrice(strategy: Vault) {
  return getTotalReceived(strategy) / getTotalCost(strategy);
}

export function getAverageCost(strategy: Vault) {
  return getTotalCost(strategy) / getTotalReceived(strategy);
}
