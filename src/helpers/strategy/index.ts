import { Strategy, StrategyStatus } from '@models/Strategy';
import { StrategyEvent } from '@hooks/StrategyEvent';
import { StrategyType } from '@models/StrategyType';
import { fromAtomic, isDenomStable, priceFromRatio } from '@utils/getDenomInfo';
import totalExecutions from '@utils/totalExecutions';
import { findPair } from '@helpers/findPair';
import { HydratedPair } from '@models/Pair';
import {
  DAYS_IN_A_WEEK,
  DELEGATION_FEE,
  HOURS_IN_A_DAY,
  MINUTES_IN_A_HOUR,
  OSMOSIS_CHAINS,
  SECONDS_IN_A_DAY,
  SECONDS_IN_A_HOUR,
  SECONDS_IN_A_MINUTE,
  SECONDS_IN_A_WEEK,
  SWAP_FEE,
} from 'src/constants';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { ChainId } from '@models/ChainId';
import { DenomInfo } from '@utils/DenomInfo';
import { getBaseDenom } from '@utils/pair';
import { safeInvert } from '@utils/safeInvert';
import { executionIntervalLabel } from '../executionIntervalDisplay';
import { formatDate } from '../format/formatDate';
import { getEndDateFromRemainingExecutions } from '../getEndDateFromRemainingExecutions';
import { getLastExecutionDateFromStrategyEvents } from '../getLastExecutionDateFromStrategyEvents';
import { isAutoStaking } from '../isAutoStaking';
import { getWeightedScaleConfig, isWeightedScale } from './isWeightedScale';
import { isDcaPlus } from './isDcaPlus';

export function isStrategyOperating(strategy: Strategy) {
  return strategy.status === StrategyStatus.ACTIVE || strategy.status === StrategyStatus.SCHEDULED;
}

export function isStrategyActive(strategy: Strategy) {
  return strategy.status === StrategyStatus.ACTIVE;
}

export function isStrategyScheduled(strategy: Strategy) {
  return strategy.status === StrategyStatus.SCHEDULED;
}

export function isStrategyCompleted(strategy: Strategy) {
  return strategy.status === StrategyStatus.COMPLETED;
}

export function isStrategyCancelled(strategy: Strategy) {
  return strategy.status === StrategyStatus.CANCELLED;
}

export function getStrategyBalance(strategy: Strategy) {
  const { balance } = strategy.rawData || {};

  return fromAtomic(strategy.initialDenom, Number(balance.amount));
}

export function getStrategyInitialDenomId(strategy: Strategy): string {
  return strategy.rawData.balance.denom;
}

export function getStrategyInitialDenom(strategy: Strategy): DenomInfo {
  return strategy.initialDenom;
}

export function getStrategyResultingDenom(strategy: Strategy): DenomInfo {
  return strategy.resultingDenom;
}

export function getStrategyExecutionIntervalData(strategy: Strategy): {
  timeInterval: ExecutionIntervals;
  timeIncrement: number | undefined;
} {
  if (strategy.rawData.time_interval instanceof Object) {
    const { custom } = strategy.rawData.time_interval;

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
  const { time_interval } = strategy.rawData;

  return {
    timeInterval: time_interval as ExecutionIntervals,
    timeIncrement: undefined,
  };
}

export function getStrategyExecutionInterval(strategy: Strategy) {
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
  if (strategy.rawData.label) {
    return strategy.rawData.label;
  }

  return `${strategy.initialDenom.name} to ${strategy.resultingDenom.name} - ${getStrategyExecutionInterval(strategy)}`;
}

export function getSlippageTolerance(strategy: Strategy) {
  const { slippage_tolerance } = strategy.rawData;
  return slippage_tolerance ? Number((Number(slippage_tolerance) * 100).toFixed(2)) : undefined;
}

export function getSlippageToleranceFormatted(strategy: Strategy) {
  const slippageTolerance = getSlippageTolerance(strategy);
  return slippageTolerance ? `${getSlippageTolerance(strategy)}%` : '-';
}

export function getSwapAmount(strategy: Strategy) {
  const { swap_amount } = strategy.rawData || {};
  return Number(swap_amount);
}

export function getConvertedSwapAmount(strategy: Strategy) {
  return Number(
    fromAtomic(strategy.initialDenom, getSwapAmount(strategy)).toFixed(strategy.initialDenom.pricePrecision),
  );
}

export function getStrategyType(strategy: Strategy) {
  if (isWeightedScale(strategy)) {
    return isDenomStable(strategy.initialDenom) ? StrategyType.WeightedScaleIn : StrategyType.WeightedScaleOut;
  }

  if (isDcaPlus(strategy)) {
    return isDenomStable(strategy.initialDenom) ? StrategyType.DCAPlusIn : StrategyType.DCAPlusOut;
  }

  return isDenomStable(strategy.initialDenom) ? StrategyType.DCAIn : StrategyType.DCAOut;
}

export function getStrategyRemainingExecutions(strategy: Strategy) {
  const balance = getStrategyBalance(strategy);
  const swapAmount = getConvertedSwapAmount(strategy);

  return totalExecutions(balance, swapAmount);
}

export function isBuyStrategy(strategy: Strategy) {
  return (
    getStrategyType(strategy) === StrategyType.DCAIn ||
    getStrategyType(strategy) === StrategyType.DCAPlusIn ||
    getStrategyType(strategy) === StrategyType.WeightedScaleIn
  );
}

export function getStrategyPriceTrigger(strategy: Strategy) {
  const { trigger } = strategy.rawData;
  if (trigger && 'price' in trigger) {
    return trigger.price.target_price;
  }
  return undefined;
}

export function getTargetPrice(strategy: Strategy, pairs: HydratedPair[] | undefined) {
  let target_price;

  if (getStrategyPriceTrigger(strategy)) {
    target_price = getStrategyPriceTrigger(strategy);
  }

  if (target_price) {
    const initialDenom = getStrategyInitialDenom(strategy);
    const resultingDenom = getStrategyResultingDenom(strategy);
    const pair = pairs && findPair(pairs, resultingDenom, initialDenom);

    if (pair && getBaseDenom(pair).id === getStrategyInitialDenom(strategy).id) {
      return safeInvert(Number(target_price));
    }

    return Number(target_price);
  }

  return null;
}

export function getStrategyStartDate(strategy: Strategy, pairs: HydratedPair[] | undefined) {
  const { trigger } = strategy.rawData;
  const denom = isBuyStrategy(strategy) ? strategy.resultingDenom : strategy.initialDenom;
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const targetPrice = getTargetPrice(strategy, pairs);

  if (targetPrice) {
    const price = Number(priceFromRatio(denom, targetPrice).toFixed(denom.pricePrecision));

    if (isBuyStrategy(strategy)) {
      return `When ${resultingDenom.name} hits ${price} ${initialDenom.name}`;
    }
    return `When ${initialDenom.name} hits ${price} ${resultingDenom.name}`;
  }

  if (isStrategyScheduled(strategy) && trigger && 'time' in trigger && trigger.time.target_time) {
    return new Date(Number(trigger.time.target_time) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  return strategy.rawData.started_at
    ? new Date(Number(strategy.rawData.started_at) / 1000000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
    : '-';
}

export function getStrategyEndDateFromRemainingExecutions(
  strategy: Strategy,
  events: StrategyEvent[] | undefined,
  executions: number,
) {
  const { trigger } = strategy.rawData;

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
      hour: 'numeric',
      minute: 'numeric',
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
  return isAutoStaking(strategy.rawData.destinations);
}

export function convertReceiveAmountOsmosis(strategy: Strategy, receiveAmount: string) {
  const { significantFigures: initialSF } = getStrategyInitialDenom(strategy);
  const { significantFigures: resultingSF } = getStrategyResultingDenom(strategy);

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

export function convertReceiveAmount(strategy: Strategy, receiveAmount: string, chain: ChainId) {
  if (OSMOSIS_CHAINS.includes(chain)) {
    return convertReceiveAmountOsmosis(strategy, receiveAmount);
  }

  const resultingDenom = getStrategyResultingDenom(strategy);
  const initialDenom = getStrategyInitialDenom(strategy);
  const denom = isBuyStrategy(strategy) ? resultingDenom : initialDenom;

  const ratio = isBuyStrategy(strategy)
    ? parseFloat(strategy.rawData.swap_amount) / parseFloat(receiveAmount)
    : parseFloat(receiveAmount) / parseFloat(strategy.rawData.swap_amount);

  return Number(priceFromRatio(denom, ratio).toFixed(denom.pricePrecision));
}

export function getPriceCeilingFloor(strategy: Strategy, chain: ChainId) {
  if (!strategy.rawData.minimum_receive_amount) {
    return undefined;
  }

  return convertReceiveAmount(strategy, strategy.rawData.minimum_receive_amount, chain);
}

export function getBasePrice(strategy: Strategy, chain: ChainId) {
  const { base_receive_amount } = getWeightedScaleConfig(strategy) || {};
  if (!base_receive_amount) {
    return undefined;
  }

  return convertReceiveAmount(strategy, base_receive_amount, chain);
}

export function getStrategyTotalFeesPaid(strategy: Strategy, dexFee: number) {
  const costAmount = strategy.rawData.swapped_amount.amount;
  const feeFactor = isDcaPlus(strategy)
    ? 0
    : SWAP_FEE + dexFee + (isStrategyAutoStaking(strategy) ? DELEGATION_FEE : 0);
  return Number(costAmount) * feeFactor;
}

export function getTotalSwapped(strategy: Strategy) {
  return fromAtomic(strategy.initialDenom, Number(strategy.rawData.swapped_amount.amount));
}

export function getTotalReceived(strategy: Strategy) {
  return fromAtomic(strategy.resultingDenom, Number(strategy.rawData.received_amount.amount));
}

export function getTotalReceivedBeforeFees(strategy: Strategy, dexFee: number) {
  const feeFactor = !isDcaPlus(strategy) ? SWAP_FEE + dexFee : dexFee;
  return getTotalReceived(strategy) / (1 - feeFactor);
}

export function getAverageSellPrice(strategy: Strategy, dexFee: number) {
  return getTotalReceivedBeforeFees(strategy, dexFee) / getTotalSwapped(strategy);
}

export function getAveragePurchasePrice(strategy: Strategy, dexFee: number) {
  return getTotalSwapped(strategy) / getTotalReceivedBeforeFees(strategy, dexFee);
}
