import { DcaInFormDataAll, initialValues } from '@models/DcaInFormData';
import { TransactionType } from '@components/TransactionType';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { ExecuteMsg as OsmosisExecuteMsg } from 'src/interfaces/generated-osmosis/execute';
import getDenomInfo from '@utils/getDenomInfo';
import { combineDateAndTime } from '@helpers/combineDateAndTime';
import { Denom } from '@models/Denom';
import { Pair } from '@models/Pair';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { FormNames } from '@hooks/useFormStore';
import { Chains, useChainStore } from '@hooks/useChain';
import { buildCallbackDestinations } from '@helpers/destinations';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import YesNoValues from '@models/YesNoValues';
import {
  SECONDS_IN_A_DAY,
  SECONDS_IN_A_HOUR,
  SECONDS_IN_A_MINUTE,
  SECONDS_IN_A_WEEK,
  featureFlags,
} from 'src/constants';
import { isNil } from 'lodash';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { safeInvert } from '@hooks/usePrice/safeInvert';
import { DcaFormState } from './DcaFormState';

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

function getSlippageWithoutTrailingZeros(slippage: number) {
  return parseFloat((slippage / 100).toFixed(4)).toString();
}

function getReceiveAmount(
  price: number | null | undefined,
  deconversion: (value: number) => number,
  swapAmount: number,
  transactionType: TransactionType,
  significantFigures: number,
) {
  if (!price) {
    return undefined;
  }

  if (transactionType === TransactionType.Buy) {
    return deconversion(Number((swapAmount / price).toFixed(significantFigures))).toString();
  }
  return deconversion(swapAmount * price).toString();
}

function getOsmosisReceiveAmount(
  initialDenom: Denom, // osmo
  swapAmount: number, // 1.2
  price: number | null | undefined, // 5.0
  resultingDenom: Denom, // weth
  transactionType: TransactionType,
) {
  // convert swap amount to microns e.g. 1.2 -> 1 200 000
  // find minimum recevie amount in initial denom scale -> 1200000 / 5 = 240 000 => initialAmount / price
  // min rcv amount * 10 ** (rcv sf - initial sf) = 240 000 * 10 ** (18 - 6) = 240 000 000000000000

  if (!price) {
    return undefined;
  }

  const { deconversion: initialDeconversion, significantFigures: initialSF } = getDenomInfo(initialDenom);
  const { significantFigures: resultingSF } = getDenomInfo(resultingDenom);

  // make the price in terms of the initial denom (doesnt matter if its buy or sell)
  const directionlessPrice = transactionType === TransactionType.Buy ? price : safeInvert(price);

  // get minimum receive amount in initial denom scale
  const deconvertedSwapAmount = initialDeconversion(swapAmount);
  const unscaledReceiveAmount = Math.floor(deconvertedSwapAmount / directionlessPrice);

  // get scaled receive amount
  const scalingFactor = 10 ** (resultingSF - initialSF);
  const scaledReceiveAmount = unscaledReceiveAmount * scalingFactor;

  return scaledReceiveAmount.toString();
}

function getMinimumReceiveAmount(
  initialDenom: Denom,
  swapAmount: number,
  priceThresholdValue: number | null | undefined,
  resultingDenom: Denom,
  transactionType: TransactionType,
) {
  const { chain } = useChainStore.getState();

  if (chain === Chains.Osmosis) {
    return getOsmosisReceiveAmount(initialDenom, swapAmount, priceThresholdValue, resultingDenom, transactionType);
  }
  const { priceConversion } =
    transactionType === TransactionType.Buy ? getDenomInfo(resultingDenom) : getDenomInfo(initialDenom);

  const { deconversion, significantFigures } = getDenomInfo(initialDenom);
  return getReceiveAmount(
    priceConversion(priceThresholdValue),
    deconversion,
    swapAmount,
    transactionType,
    significantFigures,
  );
}

function getSlippageTolerance(advancedSettings: boolean | undefined, slippageTolerance: number | null | undefined) {
  return advancedSettings && slippageTolerance
    ? getSlippageWithoutTrailingZeros(slippageTolerance)
    : getSlippageWithoutTrailingZeros(initialValues.slippageTolerance);
}

function getStartTime(startDate: Date | undefined, purchaseTime: string | undefined) {
  let startTimeSeconds;

  if (startDate) {
    const startTime = combineDateAndTime(startDate, purchaseTime);
    startTimeSeconds = (startTime.valueOf() / 1000).toString();
  }
  return startTimeSeconds;
}

function getTargetReceiveAmount(
  initialDenom: Denom,
  swapAmount: number,
  startPrice: number | null | undefined,
  resultingDenom: Denom,
  transactionType: TransactionType,
) {
  const { chain } = useChainStore.getState();

  if (chain === Chains.Osmosis) {
    return getOsmosisReceiveAmount(initialDenom, swapAmount, startPrice, resultingDenom, transactionType);
  }
  const { priceConversion } =
    transactionType === TransactionType.Buy ? getDenomInfo(resultingDenom) : getDenomInfo(initialDenom);

  const { deconversion, significantFigures } = getDenomInfo(initialDenom);
  return getReceiveAmount(priceConversion(startPrice), deconversion, swapAmount, transactionType, significantFigures);
}

function getBaseReceiveAmount(
  initialDenom: Denom,
  swapAmount: number,
  basePrice: number | null | undefined,
  resultingDenom: Denom,
  transactionType: TransactionType,
) {
  const { chain } = useChainStore.getState();
  if (chain === Chains.Osmosis) {
    return getOsmosisReceiveAmount(initialDenom, swapAmount, basePrice, resultingDenom, transactionType);
  }
  const { priceConversion } =
    transactionType === TransactionType.Buy ? getDenomInfo(resultingDenom) : getDenomInfo(initialDenom);

  const { deconversion, significantFigures } = getDenomInfo(initialDenom);
  return getReceiveAmount(priceConversion(basePrice), deconversion, swapAmount, transactionType, significantFigures);
}

function getSwapAmount(initialDenom: Denom, swapAmount: number) {
  const { deconversion } = getDenomInfo(initialDenom);

  return deconversion(swapAmount).toString();
}

function calculateSwapAmountFromDuration(initialDenom: Denom, strategyDuration: number, initialDeposit: number) {
  const { deconversion } = getDenomInfo(initialDenom);

  return deconversion(getSwapAmountFromDuration(initialDeposit, strategyDuration));
}

export function getExecutionInterval(
  executionInterval: ExecutionIntervals,
  executionIntervalIncrement: number | undefined | null,
) {
  if (featureFlags.customTimeIntervalEnabled && !isNil(executionIntervalIncrement) && executionIntervalIncrement > 0) {
    return {
      custom: {
        seconds: executionIntervalIncrement * conversion[executionInterval],
      },
    };
  }

  return executionInterval;
}

export function buildCreateVaultParamsDCA(
  state: DcaInFormDataAll,
  pairs: Pair[],
  transactionType: TransactionType,
  senderAddress: string,
) {
  const { chain } = useChainStore.getState();

  const { executionInterval, executionIntervalIncrement } = state;

  const msg = {
    create_vault: {
      label: '',
      time_interval: getExecutionInterval(executionInterval, executionIntervalIncrement),
      target_denom: state.resultingDenom,
      swap_amount: getSwapAmount(state.initialDenom, state.swapAmount),
      target_start_time_utc_seconds: getStartTime(state.startDate, state.purchaseTime),
      minimum_receive_amount: getMinimumReceiveAmount(
        state.initialDenom,
        state.swapAmount,
        state.priceThresholdValue,
        state.resultingDenom,
        transactionType,
      ),
      slippage_tolerance: getSlippageTolerance(state.advancedSettings, state.slippageTolerance),
      destinations: buildCallbackDestinations(
        chain,
        state.autoStakeValidator,
        state.recipientAccount,
        state.yieldOption,
        senderAddress,
        state.reinvestStrategy,
      ),
      target_receive_amount: getTargetReceiveAmount(
        state.initialDenom,
        state.swapAmount,
        state.startPrice,
        state.resultingDenom,
        transactionType,
      ),
    },
  } as OsmosisExecuteMsg;
  return msg;
}

export function buildCreateVaultParamsWeightedScale(
  state: WeightedScaleState,
  transactionType: TransactionType,
  senderAddress: string,
  currentPrice: number,
) {
  const { chain } = useChainStore.getState();
  const { executionInterval, executionIntervalIncrement } = state;

  const msg = {
    create_vault: {
      label: '',
      time_interval: getExecutionInterval(executionInterval, executionIntervalIncrement),
      target_denom: state.resultingDenom,
      swap_amount: getSwapAmount(state.initialDenom, state.swapAmount),
      target_start_time_utc_seconds: getStartTime(state.startDate, state.purchaseTime),
      slippage_tolerance: getSlippageTolerance(state.advancedSettings, state.slippageTolerance),
      destinations: buildCallbackDestinations(
        chain,
        state.autoStakeValidator,
        state.recipientAccount,
        state.yieldOption,
        senderAddress,
        state.reinvestStrategy,
      ),
      target_receive_amount: getTargetReceiveAmount(
        state.initialDenom,
        state.swapAmount,
        state.startPrice,
        state.resultingDenom,
        transactionType,
      ),
      minimum_receive_amount: getMinimumReceiveAmount(
        state.initialDenom,
        state.swapAmount,
        state.priceThresholdValue,
        state.resultingDenom,
        transactionType,
      ),
      swap_adjustment_strategy: {
        weighted_scale: {
          base_receive_amount: getBaseReceiveAmount(
            state.initialDenom,
            state.swapAmount,
            state.basePriceValue || currentPrice,
            state.resultingDenom,
            transactionType,
          ),
          increase_only: state.applyMultiplier === YesNoValues.No,
          multiplier: state.swapMultiplier.toString(),
        },
      },
    },
  } as OsmosisExecuteMsg;
  return msg;
}

export function buildCreateVaultParamsDCAPlus(
  state: DcaPlusState,
  pairs: Pair[],
  senderAddress: string,
): ExecuteMsg | OsmosisExecuteMsg {
  const swapAmount = calculateSwapAmountFromDuration(state.initialDenom, state.strategyDuration, state.initialDeposit);

  const { chain } = useChainStore.getState();

  const msg = {
    create_vault: {
      label: '',
      time_interval: 'daily',
      target_denom: state.resultingDenom,
      swap_amount: swapAmount.toString(),
      target_start_time_utc_seconds: undefined,
      target_receive_amount: undefined,
      slippage_tolerance: getSlippageTolerance(state.advancedSettings, state.slippageTolerance),
      destinations: buildCallbackDestinations(
        chain,
        state.autoStakeValidator,
        state.recipientAccount,
        state.yieldOption,
        senderAddress,
        state.reinvestStrategy,
      ),
      swap_adjustment_strategy: {
        risk_weighted_average: {
          base_denom: 'bitcoin',
        },
      },
      performance_assessment_strategy: 'compare_to_standard_dca',
    },
  } as OsmosisExecuteMsg;
  return msg;
}

export function buildCreateVaultParams(
  formType: FormNames,
  state: DcaFormState,
  pairs: Pair[],
  transactionType: TransactionType,
  senderAddress: string,
  currentPrice?: string,
) {
  if (formType === FormNames.DcaIn || formType === FormNames.DcaOut) {
    return buildCreateVaultParamsDCA(state as DcaInFormDataAll, pairs, transactionType, senderAddress);
  }

  if (formType === FormNames.DcaPlusIn || formType === FormNames.DcaPlusOut) {
    return buildCreateVaultParamsDCAPlus(state as DcaPlusState, pairs, senderAddress);
  }

  if (formType === FormNames.WeightedScaleIn || formType === FormNames.WeightedScaleOut) {
    if (isNil((state as WeightedScaleState).basePriceValue) && isNil(currentPrice)) {
      throw new Error('Current price has not loaded yet. Please try again');
    }
    return buildCreateVaultParamsWeightedScale(
      state as WeightedScaleState,
      transactionType,
      senderAddress,
      Number(currentPrice),
    );
  }

  throw new Error('Invalid form type');
}
