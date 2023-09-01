import { ChainConfig } from '@helpers/chains';
import { DenomInfo } from '@utils/DenomInfo';
import { ExecuteMsg } from 'kujira.js/lib/cjs/fin';
import { Config } from 'kujira.js/lib/cjs/usk';

export type DestinationConfigControlDesk = {
  recipientAccount: string | undefined;
  senderAddress: string;
};

export type BuildCreateVaultControlDeskContext = {
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  // timeInterval: {
  //   increment: number;
  //   interval: ExecutionIntervals;
  // };
  targetAmount: number;
  startPrice?: number;
  // swapAmount: number;
  // priceThreshold?: number;
  // transactionType: TransactionType;
  slippageTolerance: number;
  // swapAdjustment?: SwapAdjustment;
  destinationConfig: DestinationConfigControlDesk;
};

export function buildCreateVaultMsg(
  chainConfig: ChainConfig,
  fetchedConfig: Config,
  {
    initialDenom,
    resultingDenom,
    startPrice,
    // swapAmount,
    // priceThreshold,
    // transactionType,
    slippageTolerance,
    destinationConfig,
  }: BuildCreateVaultControlDeskContext,
): ExecuteMsg {
  // const swapAdjustmentStrategy = swapAdjustment
  //   ? buildWeightedScaleAdjustmentStrategy(
  //       initialDenom,
  //       swapAmount,
  //       swapAdjustment.basePrice,
  //       resultingDenom,
  //       transactionType,
  //       swapAdjustment.increaseOnly,
  //       swapAdjustment.swapMultiplier,
  //     )
  //   : isDcaPlus
  //   ? (buildDcaPlusAdjustmentStrategy(transactionType, fetchedConfig) as SwapAdjustmentStrategyParams)
  //   : undefined;

  // const performanceAssessmentStrategy = isDcaPlus
  //   ? ('compare_to_standard_dca' as PerformanceAssessmentStrategyParams)
  //   : undefined;

  // const msg = {
  //   create_vault: {
  //     label: '',
  //     time_interval: getExecutionInterval(timeInterval.interval, timeInterval.increment),
  //     target_denom: resultingDenom.id,
  //     swap_amount: getSwapAmount(initialDenom, swapAmount),
  //     target_start_time_utc_seconds: timeTrigger && getStartTime(timeTrigger.startDate, timeTrigger.startTime),
  //     minimum_receive_amount: priceThreshold
  //       ? getReceiveAmount(initialDenom, swapAmount, priceThreshold, resultingDenom, transactionType)
  //       : undefined,
  //     slippage_tolerance: getSlippageWithoutTrailingZeros(slippageTolerance),
  //     destinations: buildCallbackDestinations(
  //       chainConfig,
  //       destinationConfig.autoStakeValidator,
  //       destinationConfig.recipientAccount,
  //       destinationConfig.yieldOption,
  //       destinationConfig.senderAddress,
  //       destinationConfig.reinvestStrategyId,
  //     ),
  //     target_receive_amount: startPrice
  //       ? getReceiveAmount(initialDenom, swapAmount, startPrice, resultingDenom, transactionType)
  //       : undefined,
  //     swap_adjustment_strategy: swapAdjustmentStrategy,
  //     performance_assessment_strategy: performanceAssessmentStrategy,
  //   },
  // };

  return {
    launch: { msg: 'execute message' },
  };
  // return msg;
}
