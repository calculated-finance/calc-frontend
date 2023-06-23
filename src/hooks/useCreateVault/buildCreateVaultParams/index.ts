import { DcaInFormDataAll, initialValues } from '@models/DcaInFormData';
import { TransactionType } from '@components/TransactionType';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { ExecuteMsg, PositionType } from 'src/interfaces/v2/generated/execute';
import { ExecuteMsg as OsmosisExecuteMsg } from 'src/interfaces/generated-osmosis/execute';
import getDenomInfo from '@utils/getDenomInfo';
import { combineDateAndTime } from '@helpers/combineDateAndTime';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { FormNames } from '@hooks/useFormStore';
import { Chains } from '@hooks/useChain/Chains';
import { buildCallbackDestinations } from '@helpers/destinations';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import YesNoValues from '@models/YesNoValues';
import { SECONDS_IN_A_DAY, SECONDS_IN_A_HOUR, SECONDS_IN_A_MINUTE, SECONDS_IN_A_WEEK } from 'src/constants';
import { isNil } from 'lodash';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { safeInvert } from '@hooks/usePrice/safeInvert';
import { Config } from 'src/interfaces/v2/generated/response/get_config';
import { DenomInfo } from '@utils/DenomInfo';
import { DcaFormState } from '../DcaFormState';

export function getSlippageWithoutTrailingZeros(slippage: number) {
  return parseFloat((slippage / 100).toFixed(4)).toString();
}

export function getReceiveAmount(
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
    return BigInt(deconversion(Number((swapAmount / price).toFixed(significantFigures)))).toString();
  }
  return BigInt(deconversion(swapAmount * price)).toString();
}

export function getOsmosisReceiveAmount(
  initialDenom: DenomInfo | undefined, // osmo
  swapAmount: number, // 1.2
  price: number | null | undefined, // 5.0
  resultingDenom: DenomInfo | undefined, // weth
  transactionType: TransactionType,
) {
  // convert swap amount to microns e.g. 1.2 -> 1 200 000
  // find minimum recevie amount in initial denom scale -> 1200000 / 5 = 240 000 => initialAmount / price
  // min rcv amount * 10 ** (rcv sf - initial sf) = 240 000 * 10 ** (18 - 6) = 240 000 000000000000

  if (!price) {
    return undefined;
  }

  const { deconversion: initialDeconversion, significantFigures: initialSF } = initialDenom || {};
  const { significantFigures: resultingSF } = resultingDenom || {};

  if (!initialDeconversion || !initialSF || !resultingSF) {
    throw new Error('Missing denom info');
  }

  // make the price in terms of the initial denom (doesnt matter if its buy or sell)
  const directionlessPrice = transactionType === TransactionType.Buy ? price : safeInvert(price);

  // get minimum receive amount in initial denom scale
  const deconvertedSwapAmount = initialDeconversion(swapAmount);

  const unscaledReceiveAmount = deconvertedSwapAmount / directionlessPrice;

  // get scaled receive amount
  const scalingFactor = 10 ** (resultingSF - initialSF);
  const scaledReceiveAmount = unscaledReceiveAmount * scalingFactor;

  return BigInt(Math.floor(scaledReceiveAmount)).toString();
}

export function getMinimumReceiveAmount(
  initialDenom: DenomInfo | undefined,
  swapAmount: number,
  priceThresholdValue: number | null | undefined,
  resultingDenom: DenomInfo | undefined,
  transactionType: TransactionType,
  chain: Chains,
) {
  if (!initialDenom || !resultingDenom) {
    throw new Error('Missing denom info');
  }

  if (chain === Chains.Osmosis) {
    return getOsmosisReceiveAmount(initialDenom, swapAmount, priceThresholdValue, resultingDenom, transactionType);
  }
  const { priceConversion } = transactionType === TransactionType.Buy ? resultingDenom : initialDenom;

  const { deconversion, significantFigures } = initialDenom;
  return getReceiveAmount(
    priceConversion(priceThresholdValue),
    deconversion,
    swapAmount,
    transactionType,
    significantFigures,
  );
}

export function getSlippageTolerance(
  advancedSettings: boolean | undefined,
  slippageTolerance: number | null | undefined,
) {
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
  initialDenom: DenomInfo,
  swapAmount: number,
  startPrice: number | null | undefined,
  resultingDenom: DenomInfo,
  transactionType: TransactionType,
  chain: Chains,
) {
  if (chain === Chains.Osmosis) {
    return getOsmosisReceiveAmount(initialDenom, swapAmount, startPrice, resultingDenom, transactionType);
  }
  const { priceConversion } = transactionType === TransactionType.Buy ? resultingDenom : initialDenom;

  const { deconversion, significantFigures } = initialDenom;
  return getReceiveAmount(priceConversion(startPrice), deconversion, swapAmount, transactionType, significantFigures);
}

function getBaseReceiveAmount(
  initialDenom: DenomInfo,
  swapAmount: number,
  basePrice: number | null | undefined,
  resultingDenom: DenomInfo,
  transactionType: TransactionType,
  chain: Chains,
) {
  if (chain === Chains.Osmosis) {
    return getOsmosisReceiveAmount(initialDenom, swapAmount, basePrice, resultingDenom, transactionType);
  }
  const { priceConversion } = transactionType === TransactionType.Buy ? resultingDenom : initialDenom;

  const { deconversion, significantFigures } = initialDenom;
  return getReceiveAmount(priceConversion(basePrice), deconversion, swapAmount, transactionType, significantFigures);
}

function getSwapAmount(initialDenom: DenomInfo, swapAmount: number) {
  const { deconversion } = initialDenom;

  return BigInt(deconversion(swapAmount)).toString();
}

function calculateSwapAmountFromDuration(initialDenom: DenomInfo, strategyDuration: number, initialDeposit: number) {
  const { deconversion } = initialDenom;

  return BigInt(deconversion(getSwapAmountFromDuration(initialDeposit, strategyDuration)));
}

export function getExecutionInterval(
  executionInterval: ExecutionIntervals,
  executionIntervalIncrement: number | undefined | null,
) {
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
  if (!isNil(executionIntervalIncrement) && executionIntervalIncrement > 0) {
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
  transactionType: TransactionType,
  senderAddress: string,
  chain: Chains,
) {
  const { executionInterval, executionIntervalIncrement } = state;

  const initialDenomInfo = getDenomInfo(state.initialDenom);
  const resultingDenomInfo = getDenomInfo(state.resultingDenom);

  const msg = {
    create_vault: {
      label: '',
      time_interval: getExecutionInterval(executionInterval, executionIntervalIncrement),
      target_denom: resultingDenomInfo.id,
      swap_amount: getSwapAmount(initialDenomInfo, state.swapAmount),
      target_start_time_utc_seconds: getStartTime(state.startDate, state.purchaseTime),
      minimum_receive_amount: getMinimumReceiveAmount(
        initialDenomInfo,
        state.swapAmount,
        state.priceThresholdValue,
        resultingDenomInfo,
        transactionType,
        chain,
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
        initialDenomInfo,
        state.swapAmount,
        state.startPrice,
        resultingDenomInfo,
        transactionType,
        chain,
      ),
    },
  } as OsmosisExecuteMsg;
  return msg;
}

export function buildWeightedScaleAdjustmentStrategy(
  initialDenom: DenomInfo,
  swapAmount: number,
  basePriceValue: number | null | undefined,
  resultingDenom: DenomInfo,
  transactionType: TransactionType,
  applyMultiplier: YesNoValues,
  swapMultiplier: number,
  currentPrice: number,
  chain: Chains,
) {
  console.log(
    getBaseReceiveAmount(
      initialDenom,
      swapAmount,
      basePriceValue || currentPrice,
      resultingDenom,
      transactionType,
      chain,
    ),
  );
  return {
    weighted_scale: {
      base_receive_amount: getBaseReceiveAmount(
        initialDenom,
        swapAmount,
        basePriceValue || currentPrice,
        resultingDenom,
        transactionType,
        chain,
      ),
      increase_only: applyMultiplier === YesNoValues.No,
      multiplier: swapMultiplier.toString(),
    },
  };
}

export function buildCreateVaultParamsWeightedScale(
  state: WeightedScaleState,
  transactionType: TransactionType,
  senderAddress: string,
  currentPrice: number,
  chain: Chains,
) {
  const { executionInterval, executionIntervalIncrement } = state;

  const initialDenomInfo = getDenomInfo(state.initialDenom);
  const resultingDenomInfo = getDenomInfo(state.resultingDenom);

  const msg = {
    create_vault: {
      label: '',
      time_interval: getExecutionInterval(executionInterval, executionIntervalIncrement),
      target_denom: resultingDenomInfo.id,
      swap_amount: getSwapAmount(initialDenomInfo, state.swapAmount),
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
        initialDenomInfo,
        state.swapAmount,
        state.startPrice,
        resultingDenomInfo,
        transactionType,
        chain,
      ),
      minimum_receive_amount: getMinimumReceiveAmount(
        initialDenomInfo,
        state.swapAmount,
        state.priceThresholdValue,
        resultingDenomInfo,
        transactionType,
        chain,
      ),
      swap_adjustment_strategy: buildWeightedScaleAdjustmentStrategy(
        initialDenomInfo,
        state.swapAmount,
        state.basePriceValue,
        resultingDenomInfo,
        transactionType,
        state.applyMultiplier,
        state.swapMultiplier,
        currentPrice,
        chain,
      ),
    },
  } as OsmosisExecuteMsg;
  return msg;
}

export function buildCreateVaultParamsDCAPlus(
  state: DcaPlusState,
  transactionType: TransactionType,
  senderAddress: string,
  chain: Chains,
  config: Config,
): ExecuteMsg | OsmosisExecuteMsg {
  const initialDenomInfo = getDenomInfo(state.initialDenom);
  const resultingDenomInfo = getDenomInfo(state.resultingDenom);

  const swapAmount = calculateSwapAmountFromDuration(initialDenomInfo, state.strategyDuration, state.initialDeposit);

  const msg = {
    create_vault: {
      label: '',
      time_interval: 'daily',
      target_denom: resultingDenomInfo.id,
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
          ...(!!config &&
            config.exchange_contract_address && {
              position_type: (transactionType === TransactionType.Buy ? 'enter' : 'exit') as PositionType,
            }),
        },
      },
      performance_assessment_strategy: 'compare_to_standard_dca',
    },
  } as ExecuteMsg;
  return msg;
}

export function buildCreateVaultParams(
  formType: FormNames,
  state: DcaFormState,
  transactionType: TransactionType,
  senderAddress: string,
  currentPrice: number | undefined,
  chain: Chains,
  config: Config,
) {
  if (formType === FormNames.DcaIn || formType === FormNames.DcaOut) {
    return buildCreateVaultParamsDCA(state as DcaInFormDataAll, transactionType, senderAddress, chain);
  }

  if (formType === FormNames.DcaPlusIn || formType === FormNames.DcaPlusOut) {
    return buildCreateVaultParamsDCAPlus(state as DcaPlusState, transactionType, senderAddress, chain, config);
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
      chain,
    );
  }

  throw new Error('Invalid form type');
}
