import { TransactionType } from '@components/TransactionType';
import {
  Destination,
  ExecuteMsg,
  PerformanceAssessmentStrategyParams,
  PositionType,
  SwapAdjustmentStrategyParams,
} from 'src/interfaces/v2/generated/execute';
import { combineDateAndTime } from '@helpers/combineDateAndTime';
import { SECONDS_IN_A_DAY, SECONDS_IN_A_HOUR, SECONDS_IN_A_MINUTE, SECONDS_IN_A_WEEK } from 'src/constants';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { safeInvert } from '@hooks/usePrice/safeInvert';
import { DenomInfo } from '@utils/DenomInfo';
import { Strategy } from '@models/Strategy';
import { ChainConfig, getMarsAddress } from '@helpers/chains';

export function getSlippageWithoutTrailingZeros(slippage: number) {
  return parseFloat((slippage / 100).toFixed(4)).toString();
}

export function buildCallbackDestinations(
  chainConfig: ChainConfig,
  autoStakeValidator: string | null | undefined,
  recipientAccount: string | null | undefined,
  yieldOption: string | null | undefined,
  senderAddress: string,
  reinvestStrategy: Strategy | undefined,
) {
  const destinations = [] as Destination[];

  if (autoStakeValidator) {
    console.log(
      JSON.stringify({
        z_delegate: {
          delegator_address: senderAddress,
          validator_address: autoStakeValidator,
        },
      }),
    );
    destinations.push({
      address: chainConfig.contractAddress,
      allocation: '1.0',
      msg: Buffer.from(
        JSON.stringify({
          z_delegate: {
            delegator_address: senderAddress,
            validator_address: autoStakeValidator,
          },
        } as ExecuteMsg),
      ).toString('base64'),
    });
  }

  if (recipientAccount) {
    destinations.push({ address: recipientAccount, allocation: '1.0', msg: null });
  }

  if (reinvestStrategy) {
    if (reinvestStrategy.owner !== senderAddress) {
      throw new Error('Reinvest strategy does not belong to user.');
    }

    const msg = {
      deposit: {
        vault_id: reinvestStrategy.id,
        address: senderAddress,
      },
    } as ExecuteMsg;

    destinations.push({
      address: chainConfig.contractAddress,
      allocation: '1.0',
      msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
    });
  }

  if (yieldOption) {
    if (yieldOption === 'mars') {
      const msg = {
        deposit: {
          on_behalf_of: senderAddress,
        },
      };
      destinations.push({
        address: getMarsAddress(),
        allocation: '1.0',
        msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
      });
    }
  }

  return destinations.length ? destinations : undefined;
}

export function getReceiveAmount(
  initialDenom: DenomInfo, // osmo
  swapAmount: number, // 1.2
  price: number, // 5.0
  resultingDenom: DenomInfo, // weth
  transactionType: TransactionType,
) {
  // convert swap amount to microns e.g. 1.2 -> 1 200 000
  // find minimum recevie amount in initial denom scale -> 1200000 / 5 = 240 000 => initialAmount / price
  // min rcv amount * 10 ** (rcv sf - initial sf) = 240 000 * 10 ** (18 - 6) = 240 000 000000000000

  const { deconversion: initialDeconversion, significantFigures: initialSF } = initialDenom;
  const { significantFigures: resultingSF } = resultingDenom;

  // make the price in terms of the initial denom (doesnt matter if its buy or sell)
  const directionlessPrice = transactionType === TransactionType.Buy ? price : safeInvert(price);

  // get minimum receive amount in initial denom scale
  const deconvertedSwapAmount = initialDeconversion(swapAmount);

  const unscaledReceiveAmount = deconvertedSwapAmount / directionlessPrice;

  // get scaled receive amount
  const scalingFactor = 10 ** (resultingSF - initialSF);
  const scaledReceiveAmount = BigInt(Math.floor(unscaledReceiveAmount * scalingFactor));

  return scaledReceiveAmount.toString();
}

function getStartTime(startDate: Date | undefined, purchaseTime: string | undefined) {
  let startTimeSeconds;

  if (startDate) {
    const startTime = combineDateAndTime(startDate, purchaseTime);
    startTimeSeconds = (startTime.valueOf() / 1000).toString();
  }
  return startTimeSeconds;
}

function getSwapAmount(initialDenom: DenomInfo, swapAmount: number) {
  const { deconversion } = initialDenom;

  return BigInt(deconversion(swapAmount)).toString();
}

export function getExecutionInterval(executionInterval: ExecutionIntervals, executionIntervalIncrement: number) {
  const conversion: Record<ExecutionIntervals, number> = {
    minute: SECONDS_IN_A_MINUTE,
    half_hourly: SECONDS_IN_A_HOUR / 2,
    hourly: SECONDS_IN_A_HOUR,
    half_daily: SECONDS_IN_A_DAY / 2,
    daily: SECONDS_IN_A_DAY,
    weekly: SECONDS_IN_A_WEEK,
    fortnightly: SECONDS_IN_A_WEEK * 2,
    monthly: SECONDS_IN_A_WEEK * 4,
  };

  return {
    custom: {
      seconds: executionIntervalIncrement * conversion[executionInterval],
    },
  };
}
// console
// console
// console
// console

function buildWeightedScaleAdjustmentStrategy(
  initialDenom: DenomInfo,
  swapAmount: number,
  basePriceValue: number,
  resultingDenom: DenomInfo,
  transactionType: TransactionType,
  applyMultiplier: boolean,
  swapMultiplier: number,
): SwapAdjustmentStrategyParams {
  return {
    weighted_scale: {
      base_receive_amount: getReceiveAmount(initialDenom, swapAmount, basePriceValue, resultingDenom, transactionType),
      increase_only: applyMultiplier,
      multiplier: swapMultiplier.toString(),
    },
  };
}

function buildDcaPlusAdjustmentStrategy(transactionType: TransactionType): SwapAdjustmentStrategyParams {
  return {
    risk_weighted_average: {
      base_denom: 'bitcoin',
      position_type: (transactionType === TransactionType.Buy ? 'enter' : 'exit') as PositionType,
    },
  };
}

type TimeTrigger = {
  startDate: Date | undefined;
  startTime: string | undefined;
};

type SwapAdjustment = {
  basePrice: number;
  swapMultiplier: number;
  applyMultiplier: boolean;
};

export type DestinationConfig = {
  chainConfig: ChainConfig;
  autoStakeValidator: string | undefined;
  autoCompoundStakingRewards: boolean | undefined;
  recipientAccount: string | undefined;
  yieldOption: string | undefined;
  reinvestStrategyData: Strategy | undefined;
  senderAddress: string;
};

export type BuildCreateVaultContext = {
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  timeInterval: {
    increment: number;
    interval: ExecutionIntervals;
  };
  timeTrigger?: TimeTrigger;
  startPrice?: number;
  swapAmount: number;
  priceThreshold?: number;
  transactionType: TransactionType;
  slippageTolerance: number;
  swapAdjustment?: SwapAdjustment;
  performanceAssessmentStrategy?: PerformanceAssessmentStrategyParams;
  isDcaPlus?: boolean;
  destinationConfig: DestinationConfig;
};

export function buildCreateVaultMsg({
  initialDenom,
  resultingDenom,
  timeTrigger,
  startPrice,
  timeInterval,
  swapAmount,
  priceThreshold,
  transactionType,
  slippageTolerance,
  destinationConfig,
  swapAdjustment,
  isDcaPlus,
}: BuildCreateVaultContext): ExecuteMsg {
  if (isDcaPlus && swapAdjustment) {
    throw new Error('Swap adjustment is not supported for DCA+');
  }
  const swapAdjustmentStrategy = swapAdjustment
    ? buildWeightedScaleAdjustmentStrategy(
        initialDenom,
        swapAmount,
        swapAdjustment.basePrice,
        resultingDenom,
        transactionType,
        swapAdjustment.applyMultiplier,
        swapAdjustment.swapMultiplier,
      )
    : isDcaPlus
    ? buildDcaPlusAdjustmentStrategy(transactionType)
    : undefined;

  const performanceAssessmentStrategy = isDcaPlus
    ? ('compare_to_standard_dca' as PerformanceAssessmentStrategyParams)
    : undefined;

  const msg = {
    create_vault: {
      label: '',
      time_interval: getExecutionInterval(timeInterval.interval, timeInterval.increment),
      target_denom: resultingDenom.id,
      swap_amount: getSwapAmount(initialDenom, swapAmount),
      target_start_time_utc_seconds: timeTrigger && getStartTime(timeTrigger.startDate, timeTrigger.startTime),
      minimum_receive_amount: priceThreshold
        ? getReceiveAmount(initialDenom, swapAmount, priceThreshold, resultingDenom, transactionType)
        : undefined,
      slippage_tolerance: getSlippageWithoutTrailingZeros(slippageTolerance),
      destinations: buildCallbackDestinations(
        destinationConfig.chainConfig,
        destinationConfig.autoStakeValidator,
        destinationConfig.recipientAccount,
        destinationConfig.yieldOption,
        destinationConfig.senderAddress,
        destinationConfig.reinvestStrategyData,
      ),
      target_receive_amount: startPrice
        ? getReceiveAmount(initialDenom, swapAmount, startPrice, resultingDenom, transactionType)
        : undefined,
      swap_adjustment_strategy: swapAdjustmentStrategy,
      performance_assessment_strategy: performanceAssessmentStrategy,
    },
  };

  return msg;
}
