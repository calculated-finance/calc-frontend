import { DcaInFormDataAll, initialValues } from '@models/DcaInFormData';
import { TransactionType } from '@components/TransactionType';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { Destination, ExecuteMsg } from 'src/interfaces/v1/generated/execute';
import {
  Destination as OsmosisDestination,
  ExecuteMsg as OsmosisExecuteMsg,
} from 'src/interfaces/generated-osmosis/execute';
import getDenomInfo from '@utils/getDenomInfo';
import { combineDateAndTime } from '@helpers/combineDateAndTime';
import { findPair } from '@helpers/findPair';
import { Denom } from '@models/Denom';
import { Pair } from '@models/Pair';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { FormNames } from '@hooks/useFormStore';
import { useChainStore } from '@hooks/useChain';
import { buildCallbackDestinations } from '@helpers/destinations';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import YesNoValues from '@models/YesNoValues';
import { Version } from '@hooks/Version';
import { featureFlags } from 'src/constants';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { DcaFormState } from './DcaFormState';

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

function getDestinations(autoStakeValidator: string | null | undefined, recipientAccount: string | null | undefined) {
  const destinations = [] as (Destination | OsmosisDestination)[];

  if (autoStakeValidator) {
    destinations.push({ address: autoStakeValidator, allocation: '1', action: 'z_delegate' });
  }

  if (recipientAccount) {
    destinations.push({ address: recipientAccount, allocation: '1', action: 'send' });
  }

  return destinations.length ? destinations : undefined;
}

function getMinimumReceiveAmount(
  initialDenom: Denom,
  swapAmount: number,
  priceThresholdValue: number | null | undefined,
  resultingDenom: Denom,
  transactionType: TransactionType,
) {
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

function getPairAddress(initialDenom: Denom, resultingDenom: Denom, pairs: Pair[]) {
  const pairAddress = findPair(pairs, resultingDenom, initialDenom);

  if (!pairAddress) {
    throw new Error('Pair not found');
  }
  return pairAddress.address;
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

export function getExecutionInterval(executionInterval: ExecutionIntervals, executionIntervalIncrement: number) {
  const conversion = [
    executionInterval === 'minute' && 60,
    executionInterval === 'hourly' && 60 * 60,
    executionInterval === 'daily' && 60 * 60 * 24,
    executionInterval === 'weekly' && 60 * 60 * 24 * 7,
  ];
  const seconds = conversion.filter((el) => typeof el === 'number');

  if (featureFlags.customTimeIntervalEnabled) {
    return {
      custom: {
        seconds: seconds * executionIntervalIncrement,
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
  version: Version,
) {
  const { chain } = useChainStore.getState();

  if (version === 'v2') {
    const msg = {
      create_vault: {
        label: '',
        time_interval: getExecutionInterval(state.executionInterval, state.executionIntervalIncrement),
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

  const msg = {
    create_vault: {
      label: '',
      time_interval: getExecutionInterval(state.executionInterval),
      pair_address: getPairAddress(state.initialDenom, state.resultingDenom, pairs),
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
      destinations: getDestinations(state.autoStakeValidator, state.recipientAccount),
      target_receive_amount: getTargetReceiveAmount(
        state.initialDenom,
        state.swapAmount,
        state.startPrice,
        state.resultingDenom,
        transactionType,
      ),
    },
  } as ExecuteMsg;
  return msg;
}

export function buildCreateVaultParamsWeightedScale(
  state: WeightedScaleState,
  transactionType: TransactionType,
  senderAddress: string,
  currentPrice: number,
) {
  const { chain } = useChainStore.getState();

  const msg = {
    create_vault: {
      label: '',
      time_interval: getExecutionInterval(state.executionInterval),
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
  version: Version,
): ExecuteMsg | OsmosisExecuteMsg {
  const swapAmount = calculateSwapAmountFromDuration(state.initialDenom, state.strategyDuration, state.initialDeposit);

  const { chain } = useChainStore.getState();

  if (version === 'v2') {
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

  const msg = {
    create_vault: {
      label: '',
      time_interval: 'daily',
      pair_address: getPairAddress(state.initialDenom, state.resultingDenom, pairs),
      swap_amount: swapAmount.toString(),
      target_start_time_utc_seconds: undefined,
      target_receive_amount: undefined,
      slippage_tolerance: getSlippageTolerance(state.advancedSettings, state.slippageTolerance),
      destinations: getDestinations(state.autoStakeValidator, state.recipientAccount),
      use_dca_plus: true,
    },
  } as ExecuteMsg;
  return msg;
}

export function buildCreateVaultParams(
  formType: FormNames,
  state: DcaFormState,
  pairs: Pair[],
  transactionType: TransactionType,
  senderAddress: string,
  currentPrice: number,
  version: Version,
) {
  if (formType === FormNames.DcaIn || formType === FormNames.DcaOut) {
    return buildCreateVaultParamsDCA(state as DcaInFormDataAll, pairs, transactionType, senderAddress, version);
  }

  if (formType === FormNames.DcaPlusIn || formType === FormNames.DcaPlusOut) {
    return buildCreateVaultParamsDCAPlus(state as DcaPlusState, pairs, senderAddress, version);
  }

  if (formType === FormNames.WeightedScaleIn || formType === FormNames.WeightedScaleOut) {
    return buildCreateVaultParamsWeightedScale(
      state as WeightedScaleState,
      transactionType,
      senderAddress,
      currentPrice,
    );
  }

  throw new Error('Invalid form type');
}
