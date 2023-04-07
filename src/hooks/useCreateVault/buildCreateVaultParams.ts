import { DcaInFormDataAll, initialValues } from '@models/DcaInFormData';
import { TransactionType } from '@components/TransactionType';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { Destination, ExecuteMsg, TimeInterval } from 'src/interfaces/generated/execute';
import getDenomInfo from '@utils/getDenomInfo';
import { combineDateAndTime } from '@helpers/combineDateAndTime';
import { findPair } from '@helpers/findPair';
import { Denom } from '@models/Denom';
import { Pair } from '@models/Pair';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { FormNames } from '../useDcaInForm';
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
  const destinations = [] as Destination[];

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

function getSwapAmount(initialDenom: Denom, swapAmount: number) {
  const { deconversion } = getDenomInfo(initialDenom);

  return deconversion(swapAmount).toString();
}

function calculateSwapAmountFromDuration(initialDenom: Denom, strategyDuration: number, initialDeposit: number) {
  const { deconversion } = getDenomInfo(initialDenom);

  return deconversion(getSwapAmountFromDuration(initialDeposit, strategyDuration));
}

function getExecutionInterval(executionInterval: TimeInterval) {
  return executionInterval;
}

export function buildCreateVaultParamsDCA(
  state: DcaInFormDataAll,
  pairs: Pair[],
  transactionType: TransactionType,
): ExecuteMsg {
  return {
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
  };
}

export function buildCreateVaultParamsDCAPlus(state: DcaPlusState, pairs: Pair[]): ExecuteMsg {
  const swapAmount = calculateSwapAmountFromDuration(state.initialDenom, state.strategyDuration, state.initialDeposit);
  return {
    create_vault: {
      label: '',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      time_interval: 'daily',
      pair_address: getPairAddress(state.initialDenom, state.resultingDenom, pairs),
      swap_amount: swapAmount.toString(),
      target_start_time_utc_seconds: undefined,
      target_receive_amount: undefined,
      slippage_tolerance: getSlippageTolerance(state.advancedSettings, state.slippageTolerance),
      destinations: getDestinations(state.autoStakeValidator, state.recipientAccount),
      use_dca_plus: true,
    },
  };
}

export function buildCreateVaultParams(
  formType: FormNames,
  state: DcaFormState,
  pairs: Pair[],
  transactionType: TransactionType,
) {
  if (formType === FormNames.DcaIn || formType === FormNames.DcaOut) {
    return buildCreateVaultParamsDCA(state as DcaInFormDataAll, pairs, transactionType);
  }

  if (formType === FormNames.DcaPlusIn || formType === FormNames.DcaPlusOut) {
    return buildCreateVaultParamsDCAPlus(state as DcaPlusState, pairs);
  }

  throw new Error('Invalid form type');
}
