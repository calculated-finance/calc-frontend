import { Strategy, StrategyOsmosis } from '@hooks/useStrategies';
import { StrategyEvent } from '@hooks/useStrategyEvents';
import { Denom, Denoms } from '@models/Denom';
import { StrategyTypes } from '@models/StrategyTypes';
import getDenomInfo, { convertDenomFromCoin, isDenomStable } from '@utils/getDenomInfo';
import totalExecutions from '@utils/totalExecutions';
import { Vault } from 'src/interfaces/v2/generated/response/get_vaults_by_address';
import { safeInvert } from '@hooks/usePrice/safeInvert';
import { findPair } from '@helpers/findPair';
import { Pair } from '@models/Pair';
import {
  DAYS_IN_A_WEEK,
  DELEGATION_FEE,
  HOURS_IN_A_DAY,
  MINUTES_IN_A_HOUR,
  SECONDS_IN_A_DAY,
  SECONDS_IN_A_HOUR,
  SECONDS_IN_A_MINUTE,
  SECONDS_IN_A_WEEK,
  SWAP_FEE,
} from 'src/constants';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { useChainStore } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import { executionIntervalLabel } from '../executionIntervalDisplay';
import { formatDate } from '../format/formatDate';
import { getEndDateFromRemainingExecutions } from '../getEndDateFromRemainingExecutions';
import { getLastExecutionDateFromStrategyEvents } from '../getLastExecutionDateFromStrategyEvents';
import { isAutoStaking } from '../isAutoStaking';
import { getWeightedScaleConfig, isWeightedScale } from './isWeightedScale';
import { isDcaPlus } from './isDcaPlus';

export function getStrategyStatus(strategy: Strategy) {
  if (strategy.status === 'inactive') {
    return 'completed';
  }
  return strategy.status;
}

export function isStrategyOperating(strategy: Strategy | StrategyOsmosis) {
  return ['active', 'scheduled'].includes(strategy.status);
}

export function isStrategyActive(strategy: Strategy) {
  return ['active'].includes(strategy.status);
}

export function isStrategyScheduled(strategy: Strategy | StrategyOsmosis) {
  return ['scheduled'].includes(strategy.status);
}

export function isStrategyCompleted(strategy: Strategy) {
  return ['inactive'].includes(strategy.status);
}

export function isStrategyCancelled(strategy: Strategy | StrategyOsmosis) {
  return ['cancelled'].includes(strategy.status);
}

export default function getStrategyBalance(strategy: Strategy | StrategyOsmosis) {
  const { balance } = strategy || {};

  return convertDenomFromCoin(balance);
}

export function getStrategyInitialDenom(strategy: Strategy): Denom {
  return strategy.balance.denom;
}

export function getStrategyResultingDenom(strategy: Strategy): Denom {
  return strategy.received_amount.denom;
}

export function getStrategyExecutionIntervalData(strategy: Strategy | StrategyOsmosis): {
  timeInterval: ExecutionIntervals;
  timeIncrement: number | undefined;
} {
  if (strategy.time_interval instanceof Object) {
    const { custom } = strategy.time_interval;

    const weeks = Math.floor(custom.seconds / SECONDS_IN_A_DAY / DAYS_IN_A_WEEK);
    const days = Math.floor(custom.seconds / SECONDS_IN_A_HOUR / HOURS_IN_A_DAY);
    const hours = Math.floor(custom.seconds / SECONDS_IN_A_MINUTE / MINUTES_IN_A_HOUR);
    const minutes = Math.floor(custom.seconds / SECONDS_IN_A_MINUTE);

    if (custom) {
      if (custom.seconds % SECONDS_IN_A_WEEK === 0) {
        return {
          timeInterval: 'weekly',
          timeIncrement: weeks,
        };
      }
      if (custom.seconds % SECONDS_IN_A_DAY === 0) {
        return {
          timeInterval: 'daily',
          timeIncrement: days,
        };
      }
      if (custom.seconds % SECONDS_IN_A_HOUR === 0) {
        return {
          timeInterval: 'hourly',
          timeIncrement: hours,
        };
      }
      if (custom.seconds % SECONDS_IN_A_MINUTE === 0) {
        return {
          timeInterval: 'minute',
          timeIncrement: minutes,
        };
      }
    }
  }
  const { time_interval } = strategy as Strategy;

  return {
    timeInterval: time_interval as ExecutionIntervals,
    timeIncrement: undefined,
  };
}

export function getStrategyExecutionInterval(strategy: Strategy | StrategyOsmosis) {
  const { timeInterval, timeIncrement } = getStrategyExecutionIntervalData(strategy);

  if (timeIncrement) {
    if (timeInterval === 'weekly') {
      return `${timeIncrement} Week`;
    }
    if (timeInterval === 'daily') {
      return `${timeIncrement} Day`;
    }
    if (timeInterval === 'hourly') {
      return `${timeIncrement} Hour`;
    }
    if (timeInterval === 'minute') {
      return `${timeIncrement} Minute`;
    }
  }

  return executionIntervalLabel[timeInterval];
}

export function getStrategyName(strategy: Strategy) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  return `${getDenomInfo(initialDenom).name} to ${getDenomInfo(resultingDenom).name} - ${getStrategyExecutionInterval(
    strategy,
  )}`;
}

export function getSlippageTolerance(strategy: Strategy) {
  const { slippage_tolerance } = strategy;
  return slippage_tolerance ? (Number(slippage_tolerance) * 100).toFixed(2) : undefined;
}

export function getSlippageToleranceFormatted(strategy: Strategy) {
  const slippageTolerance = getSlippageTolerance(strategy);
  return slippageTolerance ? `${getSlippageTolerance(strategy)}%` : '-';
}

export function getSwapAmount(strategy: Strategy | StrategyOsmosis) {
  const { swap_amount } = strategy || {};
  return Number(swap_amount);
}

export function getConvertedSwapAmount(strategy: Strategy | StrategyOsmosis) {
  const { conversion } = getDenomInfo(strategy.swapped_amount.denom);
  return Number(conversion(getSwapAmount(strategy)).toFixed(6));
}

export function getStrategyType(strategy: Strategy) {
  const initialDenom = getStrategyInitialDenom(strategy);

  if (isWeightedScale(strategy)) {
    return isDenomStable(initialDenom) ? StrategyTypes.WeightedScaleIn : StrategyTypes.WeightedScaleOut;
  }

  if (isDcaPlus(strategy)) {
    return isDenomStable(initialDenom) ? StrategyTypes.DCAPlusIn : StrategyTypes.DCAPlusOut;
  }

  return isDenomStable(initialDenom) ? StrategyTypes.DCAIn : StrategyTypes.DCAOut;
}

export function getStrategyRemainingExecutions(strategy: Strategy | StrategyOsmosis) {
  const balance = getStrategyBalance(strategy);
  const swapAmount = getConvertedSwapAmount(strategy);

  return totalExecutions(balance, swapAmount);
}

export function isBuyStrategy(strategy: Strategy) {
  return (
    getStrategyType(strategy) === StrategyTypes.DCAIn ||
    getStrategyType(strategy) === StrategyTypes.DCAPlusIn ||
    getStrategyType(strategy) === StrategyTypes.WeightedScaleIn
  );
}

export function getStrategyPriceTrigger(strategy: Strategy) {
  const { trigger } = strategy;
  if (trigger && 'price' in trigger) {
    return trigger.price.target_price;
  }
  return undefined;
}

export function getTargetPrice(strategy: Strategy, pairs: Pair[] | undefined) {
  let target_price;

  if (getStrategyPriceTrigger(strategy)) {
    target_price = getStrategyPriceTrigger(strategy);
  }

  if (target_price) {
    const initialDenom = getStrategyInitialDenom(strategy);
    const resultingDenom = getStrategyResultingDenom(strategy);
    const pair = pairs && findPair(pairs, resultingDenom, initialDenom);
    if (pair && pair.base_denom === getStrategyInitialDenom(strategy)) {
      return safeInvert(Number(target_price));
    }
    return Number(target_price);
  }

  return null;
}

export function getStrategyStartDate(strategy: Strategy, pairs: Pair[] | undefined) {
  const { trigger } = strategy;
  const { priceDeconversion, pricePrecision } = isBuyStrategy(strategy)
    ? getDenomInfo(getStrategyResultingDenom(strategy))
    : getDenomInfo(getStrategyInitialDenom(strategy));
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const targetPrice = getTargetPrice(strategy, pairs);

  if (targetPrice) {
    const price = Number(priceDeconversion(targetPrice).toFixed(pricePrecision));

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

export function getStrategyEndDateFromRemainingExecutions(
  strategy: Strategy | StrategyOsmosis,
  events: StrategyEvent[] | undefined,
  executions: number,
) {
  const { trigger } = strategy;

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

export function getStrategyEndDate(strategy: Strategy, events: StrategyEvent[] | undefined) {
  if (getStrategyPriceTrigger(strategy)) {
    return 'Pending strategy start';
  }

  const executions = getStrategyRemainingExecutions(strategy);

  return getStrategyEndDateFromRemainingExecutions(strategy, events, executions);
}

export function isStrategyAutoStaking(strategy: Strategy) {
  return isAutoStaking(strategy.destinations);
}

export function convertReceiveAmountOsmosis(strategy: Strategy, receiveAmount: string) {
  const { significantFigures: initialSF } = getDenomInfo(getStrategyInitialDenom(strategy));
  const { significantFigures: resultingSF } = getDenomInfo(getStrategyResultingDenom(strategy));

  // start with scaled receive amount
  const scaledReceiveAmount = Number(receiveAmount);

  // get unscaled receive amount
  const scalingFactor = 10 ** (resultingSF - initialSF);
  const unscaledReceiveAmount = scaledReceiveAmount / scalingFactor;

  // get directionless price
  const deconvertedSwapAmount = Number(getSwapAmount(strategy));
  const directionlessPrice = deconvertedSwapAmount / unscaledReceiveAmount;

  // get directed price
  const directedPrice = isBuyStrategy(strategy) ? directionlessPrice : safeInvert(directionlessPrice);

  return Number(directedPrice.toFixed(6));
}

export function convertReceiveAmount(strategy: Strategy, receiveAmount: string) {
  const { chain } = useChainStore.getState();

  if (chain === Chains.Osmosis) {
    return convertReceiveAmountOsmosis(strategy, receiveAmount);
  }

  const resultingDenom = getStrategyResultingDenom(strategy);
  const initialDenom = getStrategyInitialDenom(strategy);
  const { priceDeconversion, pricePrecision } = isBuyStrategy(strategy)
    ? getDenomInfo(resultingDenom)
    : getDenomInfo(initialDenom);

  const price = isBuyStrategy(strategy)
    ? parseFloat(strategy.swap_amount) / parseFloat(receiveAmount)
    : parseFloat(receiveAmount) / parseFloat(strategy.swap_amount);

  return Number(priceDeconversion(price).toFixed(pricePrecision));
}

export function getPriceCeilingFloor(strategy: Vault) {
  if (!strategy.minimum_receive_amount) {
    return undefined;
  }

  return convertReceiveAmount(strategy, strategy.minimum_receive_amount);
}

export function getBasePrice(strategy: Vault) {
  const { base_receive_amount } = getWeightedScaleConfig(strategy) || {};
  if (!base_receive_amount) {
    return undefined;
  }

  return convertReceiveAmount(strategy, base_receive_amount);
}

export function getStrategyTotalFeesPaid(strategy: Strategy, dexFee: number) {
  const costAmount = strategy.swapped_amount.amount;
  const feeFactor = isDcaPlus(strategy)
    ? 0
    : SWAP_FEE + dexFee + (isStrategyAutoStaking(strategy) ? DELEGATION_FEE : 0);
  return Number(costAmount) * feeFactor;
}

export function getTotalSwapped(strategy: Strategy) {
  return convertDenomFromCoin(strategy.swapped_amount);
}

export function getTotalReceived(strategy: Strategy) {
  return convertDenomFromCoin(strategy.received_amount);
}

export function hasSwapFees(strategy: Strategy) {
  return (
    !isDcaPlus(strategy) &&
    getStrategyInitialDenom(strategy) !== Denoms.USK &&
    getStrategyResultingDenom(strategy) !== Denoms.USK
  );
}

export function getTotalReceivedBeforeFees(strategy: Strategy, dexFee: number) {
  const feeFactor = hasSwapFees(strategy) ? SWAP_FEE + dexFee : dexFee;
  return getTotalReceived(strategy) / (1 - feeFactor);
}

export function getAverageSellPrice(strategy: Vault, dexFee: number) {
  return getTotalReceivedBeforeFees(strategy, dexFee) / getTotalSwapped(strategy);
}

export function getAveragePurchasePrice(strategy: Vault, dexFee: number) {
  return getTotalSwapped(strategy) / getTotalReceivedBeforeFees(strategy, dexFee);
}
