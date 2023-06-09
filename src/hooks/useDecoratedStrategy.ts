import getStrategyBalance, {
  getStrategyStatus,
  isStrategyOperating,
  isStrategyActive,
  isStrategyScheduled,
  isStrategyCompleted,
  isStrategyCancelled,
  getStrategyInitialDenomId,
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  getStrategyExecutionIntervalData,
  getStrategyExecutionInterval,
  getStrategyName,
  getSlippageToleranceFormatted,
  getSwapAmount,
  getConvertedSwapAmount,
  getStrategyType,
  getStrategyRemainingExecutions,
  isBuyStrategy,
  getStrategyPriceTrigger,
  getTargetPrice,
  getStrategyStartDate,
  getStrategyEndDate,
  isStrategyAutoStaking,
  getPriceCeilingFloor,
  getBasePrice,
  getStrategyTotalFeesPaid,
  getTotalSwapped,
  getTotalReceived,
  hasSwapFees,
  getTotalReceivedBeforeFees,
  getAverageSellPrice,
  getAveragePurchasePrice,
  getSlippageTolerance,
} from '@helpers/strategy';
import pairs from 'src/fixtures/pairs';
import { Vault } from 'src/interfaces/v2/generated/response/get_vault';
import { getLatestSwapError } from 'src/pages/strategies/details/getLatestSwapError';
import { getLastExecutionDateFromStrategyEvents } from '@helpers/getLastExecutionDateFromStrategyEvents';
import {
  getStandardDcaTotalReceived,
  getStandardDcaTotalSwapped,
  getStandardDcaTotalCost,
  getStandardDcaTotalDeposit,
  getStandardDcaTotalReceivedBeforeFees,
  getStandardDcaAveragePurchasePrice,
  getStandardDcaAverageSellPrice,
  getEscrowLevel,
  getEscrowAmount,
  getAccumulationGained,
  getSwappedSaved,
  getNumberOfPastSwaps,
  getStrategyModel,
  getStrategySwapRange,
  getPerformanceFactor,
  getReturnedEscrowAmount,
  getStandardDcaRemainingBalance,
  getRemainingExecutionsRange,
  getStandardDcaRemainingExecutions,
  isEscrowPending,
  getStandardDcaEndDate,
  getStrategyEndDateRange,
} from '@helpers/strategy/dcaPlus';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { Strategy } from './useStrategies';
import useStrategy from './useStrategy';
import useStrategyEvents from './useStrategyEvents';

// eslint-disable-next-line @typescript-eslint/ban-types
type NotFunction = never & {
  (): never;
};

type DecoratedStrategy = {
  getStrategyStatus: string;

  isStrategyOperating: NotFunction;
  isStrategyActive: NotFunction;

  isStrategyScheduled: NotFunction;
  isStrategyCompleted: NotFunction;

  isStrategyCancelled: NotFunction;

  getStrategyBalance: NotFunction;

  getStrategyInitialDenomId: NotFunction;

  getStrategyInitialDenom: NotFunction;

  getStrategyResultingDenom: NotFunction;

  getStrategyExecutionIntervalData: NotFunction;
  getStrategyExecutionInterval: NotFunction;

  getStrategyName: NotFunction;

  getSlippageTolerance: NotFunction;
  getSlippageToleranceFormatted: NotFunction;

  getSwapAmount: NotFunction;

  getConvertedSwapAmount: NotFunction;

  getStrategyType: NotFunction;

  getStrategyRemainingExecutions: NotFunction;

  isBuyStrategy: NotFunction;

  getStrategyPriceTrigger: NotFunction;

  getTargetPrice: NotFunction;

  getStrategyStartDate: NotFunction;

  getStrategyEndDate: NotFunction;

  isStrategyAutoStaking: NotFunction;

  getPriceCeilingFloor: NotFunction;

  getBasePrice: NotFunction;

  getStrategyTotalFeesPaid: NotFunction;

  getTotalSwapped: NotFunction;
  getTotalReceived: NotFunction;

  hasSwapFees: NotFunction;

  getTotalReceivedBeforeFees: NotFunction;

  getAverageSellPrice: NotFunction;

  getAveragePurchasePrice: NotFunction;
  getLatestSwapError: NotFunction;
  getStandardDcaTotalReceived: NotFunction;
  getStandardDcaTotalSwapped: NotFunction;
  getStandardDcaTotalCost: NotFunction;
  getStandardDcaTotalDeposit: NotFunction;
  getStandardDcaTotalReceivedBeforeFees: NotFunction;
  getStandardDcaAveragePurchasePrice: NotFunction;
  getStandardDcaAverageSellPrice: NotFunction;
  getEscrowLevel: NotFunction;
  getEscrowAmount: NotFunction;
  getAccumulationGained: NotFunction;
  getSwappedSaved: NotFunction;
  getNumberOfPastSwaps: NotFunction;
  getStrategyModel: NotFunction;
  getStrategySwapRange: NotFunction;
  getPerformanceFactor: NotFunction;
  getReturnedEscrowAmount: NotFunction;
  getStandardDcaRemainingBalance: NotFunction;
  getRemainingExecutionsRange: NotFunction;
  getStandardDcaRemainingExecutions: NotFunction;
  isEscrowPending: NotFunction;
  getLastExecutionDateFromStrategyEvents: NotFunction;
  getStandardDcaEndDate: NotFunction;
  getStrategyEndDateRange: NotFunction;
  isDcaPlus: NotFunction;
};
type UseDecoratedStrategy = {
  isLoading: boolean;
  strategy: DecoratedStrategy | undefined;
  strategyData: Strategy | undefined;
};

export function useDecoratedStrategy(id: Strategy['id']): UseDecoratedStrategy {
  const { data: strategyData, isLoading } = useStrategy(id);
  const { data: events, isLoading: isLoadingEvents } = useStrategyEvents(id);

  const strategy = strategyData?.vault;

  const dexFee = 0;

  // todo: fix this
  const performance = undefined;

  const decoratedStrategy =
    events && strategy
      ? ({
          ...strategy,

          isDcaPlus: isDcaPlus(strategy),
          getStrategyStatus: getStrategyStatus(strategy),

          isStrategyOperating: isStrategyOperating(strategy),
          isStrategyActive: isStrategyActive(strategy),

          isStrategyScheduled: isStrategyScheduled(strategy),
          isStrategyCompleted: isStrategyCompleted(strategy),

          isStrategyCancelled: isStrategyCancelled(strategy),

          getStrategyBalance: getStrategyBalance(strategy),

          getStrategyInitialDenomId: getStrategyInitialDenomId(strategy),

          getStrategyInitialDenom: getStrategyInitialDenom(strategy),

          getStrategyResultingDenom: getStrategyResultingDenom(strategy),

          getStrategyExecutionIntervalData: getStrategyExecutionIntervalData(strategy),
          getStrategyExecutionInterval: getStrategyExecutionInterval(strategy),

          getStrategyName: getStrategyName(strategy),

          getSlippageTolerance: getSlippageTolerance(strategy),
          getSlippageToleranceFormatted: getSlippageToleranceFormatted(strategy),

          getSwapAmount: getSwapAmount(strategy),

          getConvertedSwapAmount: getConvertedSwapAmount(strategy),

          getStrategyType: getStrategyType(strategy),

          getStrategyRemainingExecutions: getStrategyRemainingExecutions(strategy),

          isBuyStrategy: isBuyStrategy(strategy),

          getStrategyPriceTrigger: getStrategyPriceTrigger(strategy),

          getTargetPrice: getTargetPrice(strategy, pairs),

          getStrategyStartDate: getStrategyStartDate(strategy, pairs),

          getStrategyEndDate: getStrategyEndDate(strategy, events),

          isStrategyAutoStaking: isStrategyAutoStaking(strategy),

          getPriceCeilingFloor: getPriceCeilingFloor(strategy),

          getBasePrice: getBasePrice(strategy),

          getStrategyTotalFeesPaid: getStrategyTotalFeesPaid(strategy, dexFee),

          getTotalSwapped: getTotalSwapped(strategy),
          getTotalReceived: getTotalReceived(strategy),

          hasSwapFees: hasSwapFees(strategy),

          getTotalReceivedBeforeFees: getTotalReceivedBeforeFees(strategy, dexFee),

          getAverageSellPrice: getAverageSellPrice(strategy, dexFee),

          getAveragePurchasePrice: getAveragePurchasePrice(strategy, dexFee),
          getLatestSwapError: getLatestSwapError(strategy, events),

          // dcaplus things
          getStandardDcaTotalReceived: getStandardDcaTotalReceived(strategy),
          getStandardDcaTotalSwapped: getStandardDcaTotalSwapped(strategy),
          getStandardDcaTotalCost: getStandardDcaTotalCost(strategy, dexFee),
          getStandardDcaTotalDeposit: getStandardDcaTotalDeposit(strategy),
          getStandardDcaTotalReceivedBeforeFees: getStandardDcaTotalReceivedBeforeFees(strategy, dexFee),
          getStandardDcaAveragePurchasePrice: getStandardDcaAveragePurchasePrice(strategy, dexFee),
          getStandardDcaAverageSellPrice: getStandardDcaAverageSellPrice(strategy, dexFee),
          getEscrowLevel: getEscrowLevel(strategy),
          getEscrowAmount: getEscrowAmount(strategy),
          getAccumulationGained: getAccumulationGained(strategy),
          getSwappedSaved: getSwappedSaved(strategy),
          getNumberOfPastSwaps: getNumberOfPastSwaps(strategy),
          getStrategyModel: getStrategyModel(strategy),
          getStrategySwapRange: getStrategySwapRange(strategy),
          getPerformanceFactor: getPerformanceFactor(performance),
          getReturnedEscrowAmount: getReturnedEscrowAmount(strategy, performance),
          getStandardDcaRemainingBalance: getStandardDcaRemainingBalance(strategy),
          getRemainingExecutionsRange: getRemainingExecutionsRange(strategy),
          getStandardDcaRemainingExecutions: getStandardDcaRemainingExecutions(strategy),
          isEscrowPending: isEscrowPending(strategy),
          getLastExecutionDateFromStrategyEvents: getLastExecutionDateFromStrategyEvents(events),
          getStandardDcaEndDate: getStandardDcaEndDate(strategy, events),
          getStrategyEndDateRange: getStrategyEndDateRange(strategy, events),
        } as DecoratedStrategy)
      : undefined;

  return {
    isLoading: isLoading || isLoadingEvents,
    strategy: decoratedStrategy,
    strategyData: strategy,
  };
}
