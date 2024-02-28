import { TransactionType } from '@components/TransactionType';
import {
  BaseDenom,
  Destination,
  ExecuteMsg,
  PerformanceAssessmentStrategyParams,
  PositionType,
  SwapAdjustmentStrategyParams,
} from 'src/interfaces/v2/generated/execute';
import { combineDateAndTime } from '@helpers/combineDateAndTime';
import { SECONDS_IN_A_DAY, SECONDS_IN_A_HOUR, SECONDS_IN_A_MINUTE, SECONDS_IN_A_WEEK } from 'src/constants';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { DenomInfo } from '@utils/DenomInfo';
import { ChainConfig, getRedBankAddress } from '@helpers/chains';
import { Config } from 'src/interfaces/v2/generated/response/get_config';
import { safeInvert } from '@utils/safeInvert';
import { toAtomic } from '@utils/getDenomInfo';

export function getSlippageWithoutTrailingZeros(slippage: number) {
  return parseFloat((slippage / 100).toFixed(4)).toString();
}

export function buildCallbackDestinations(
  chainConfig: ChainConfig,
  autoStakeValidator: string | null | undefined,
  recipientAccount: string | null | undefined,
  yieldOption: string | null | undefined,
  senderAddress: string,
  reinvestStrategyId: string | undefined,
) {
  const destinations = [] as Destination[];

  if (autoStakeValidator) {
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

  if (reinvestStrategyId) {
    const msg = {
      deposit: {
        vault_id: reinvestStrategyId,
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
        address: getRedBankAddress(chainConfig.id),
        allocation: '1.0',
        msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
      });
    }
  }

  return destinations.length ? destinations : undefined;
}

export function getReceiveAmount(
  initialDenom: DenomInfo,
  swapAmount: number,
  price: number,
  resultingDenom: DenomInfo,
  transactionType: TransactionType,
) {
  const directionlessPrice = transactionType === TransactionType.Buy ? price : safeInvert(price);

  const unscaledReceiveAmount = Math.round(swapAmount / directionlessPrice);
  const scalingFactor = 10 ** (resultingDenom.significantFigures - initialDenom.significantFigures);
  const scaledReceiveAmount = BigInt(Math.round(unscaledReceiveAmount * scalingFactor));

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

export function getSwapAmount(initialDenom: DenomInfo, swapAmount: number) {
  return BigInt(toAtomic(initialDenom, swapAmount)).toString();
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

export function buildWeightedScaleAdjustmentStrategy(
  initialDenom: DenomInfo,
  swapAmount: number,
  basePriceValue: number,
  resultingDenom: DenomInfo,
  transactionType: TransactionType,
  increaseOnly: boolean,
  swapMultiplier: number,
): SwapAdjustmentStrategyParams {
  return {
    weighted_scale: {
      base_receive_amount: getReceiveAmount(initialDenom, swapAmount, basePriceValue, resultingDenom, transactionType),
      increase_only: increaseOnly,
      multiplier: swapMultiplier.toString(),
    },
  };
}

function buildDcaPlusAdjustmentStrategy(
  transactionType: TransactionType,
  fetchedConfig: Config,
):
  | SwapAdjustmentStrategyParams
  // TODO: remove after backend is updated
  | {
      risk_weighted_average: {
        base_denom: BaseDenom;
      };
    } {
  return {
    risk_weighted_average: {
      base_denom: 'bitcoin',
      ...(!!fetchedConfig &&
        fetchedConfig.exchange_contract_address && {
          position_type: (transactionType === TransactionType.Buy ? 'enter' : 'exit') as PositionType,
        }),
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
  increaseOnly: boolean;
};

export type DestinationConfig = {
  autoStakeValidator: string | undefined;
  autoCompoundStakingRewards: boolean | undefined;
  recipientAccount: string | undefined;
  yieldOption: string | undefined;
  reinvestStrategyId: string | undefined;
  senderAddress: string;
};

export type BuildCreateVaultContext = {
  label?: string;
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  timeInterval: {
    increment: number;
    interval: ExecutionIntervals;
  };
  route?: string;
  timeTrigger?: TimeTrigger;
  startPrice?: number;
  swapAmount: number;
  priceThreshold?: number;
  transactionType: TransactionType;
  slippageTolerance?: number;
  swapAdjustment?: SwapAdjustment;
  isDcaPlus?: boolean;
  destinationConfig: DestinationConfig;
  isInAtomics?: boolean;
};

export function buildCreateVaultMsg(
  chainConfig: ChainConfig,
  fetchedConfig: Config,
  {
    label,
    initialDenom,
    resultingDenom,
    route,
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
    isInAtomics,
  }: BuildCreateVaultContext,
): ExecuteMsg {
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
        swapAdjustment.increaseOnly,
        swapAdjustment.swapMultiplier,
      )
    : isDcaPlus
    ? (buildDcaPlusAdjustmentStrategy(transactionType, fetchedConfig) as SwapAdjustmentStrategyParams)
    : undefined;

  const performanceAssessmentStrategy = isDcaPlus
    ? ('compare_to_standard_dca' as PerformanceAssessmentStrategyParams)
    : undefined;

  const msg = {
    create_vault: {
      label,
      time_interval: getExecutionInterval(timeInterval.interval, timeInterval.increment),
      target_denom: resultingDenom.id,
      route,
      swap_amount: BigInt(Math.round(swapAmount)).toString(),
      target_start_time_utc_seconds: timeTrigger && getStartTime(timeTrigger.startDate, timeTrigger.startTime),
      minimum_receive_amount: priceThreshold
        ? getReceiveAmount(initialDenom, swapAmount, priceThreshold, resultingDenom, transactionType)
        : undefined,
      slippage_tolerance: slippageTolerance ? getSlippageWithoutTrailingZeros(slippageTolerance) : null,
      destinations: buildCallbackDestinations(
        chainConfig,
        destinationConfig.autoStakeValidator,
        destinationConfig.recipientAccount,
        destinationConfig.yieldOption,
        destinationConfig.senderAddress,
        destinationConfig.reinvestStrategyId,
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
