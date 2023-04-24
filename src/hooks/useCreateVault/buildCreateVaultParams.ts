import { DcaInFormDataAll, initialValues } from '@models/DcaInFormData';
import { TransactionType } from '@components/TransactionType';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { Destination, ExecuteMsg, TimeInterval } from 'src/interfaces/generated/execute';
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
import { Chains, useChainStore } from '@hooks/useChain';
import { getChainContractAddress, getMarsAddress } from '@helpers/chains';
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

function getCallbackDestinations(
  autoStakeValidator: string | null | undefined,
  recipientAccount: string | null | undefined,
  yieldOption: string | null | undefined,
  senderAddress: string,
) {
  const destinations = [] as (Destination | OsmosisDestination)[];

  if (autoStakeValidator) {
    destinations.push({
      address: getChainContractAddress(Chains.Osmosis),
      allocation: '1.0',
      msg: Buffer.from(
        JSON.stringify({
          z_delegate: {
            delegator_address: senderAddress,
            validator_address: autoStakeValidator,
          },
        }),
      ).toString('base64'),
    });
  }

  if (recipientAccount) {
    destinations.push({ address: recipientAccount, allocation: '1.0', msg: null });
  }

  if (yieldOption) {
    if (yieldOption === 'mars') {
      const msg = {
        deposit: {
          on_behalf_of: senderAddress,
        },
      };
      console.log(msg);
      destinations.push({
        address: getMarsAddress(),
        allocation: '1.0',
        msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
      });
    }
  }

  return destinations.length ? destinations : undefined;
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
  senderAddress: string,
) {
  const { chain } = useChainStore.getState();

  const destinations =
    chain === Chains.Osmosis
      ? getCallbackDestinations(state.autoStakeValidator, state.recipientAccount, state.yieldOption, senderAddress)
      : getDestinations(state.autoStakeValidator, state.recipientAccount);

  const pairAddressOrTargetDenom =
    chain === Chains.Osmosis
      ? {
          target_denom: state.resultingDenom,
        }
      : {
          pair_address: getPairAddress(state.initialDenom, state.resultingDenom, pairs),
        };

  const msg = {
    create_vault: {
      label: '',
      time_interval: getExecutionInterval(state.executionInterval),
      ...pairAddressOrTargetDenom,
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
      destinations,
      target_receive_amount: getTargetReceiveAmount(
        state.initialDenom,
        state.swapAmount,
        state.startPrice,
        state.resultingDenom,
        transactionType,
      ),
    },
  };

  if (chain === Chains.Osmosis) {
    return msg as OsmosisExecuteMsg;
  }
  return msg as ExecuteMsg;
}

export function buildCreateVaultParamsDCAPlus(
  state: DcaPlusState,
  pairs: Pair[],
  senderAddress: string,
): ExecuteMsg | OsmosisExecuteMsg {
  const swapAmount = calculateSwapAmountFromDuration(state.initialDenom, state.strategyDuration, state.initialDeposit);

  const { chain } = useChainStore.getState();

  const destinations =
    chain === Chains.Osmosis
      ? getCallbackDestinations(state.autoStakeValidator, state.recipientAccount, state.yieldOption, senderAddress)
      : getDestinations(state.autoStakeValidator, state.recipientAccount);

  const pairAddressOrTargetDenom =
    chain === Chains.Osmosis
      ? {
          target_denom: state.resultingDenom,
        }
      : {
          pair_address: getPairAddress(state.initialDenom, state.resultingDenom, pairs),
        };

  const msg = {
    create_vault: {
      label: '',
      time_interval: 'daily',
      ...pairAddressOrTargetDenom,
      swap_amount: swapAmount.toString(),
      target_start_time_utc_seconds: undefined,
      target_receive_amount: undefined,
      slippage_tolerance: getSlippageTolerance(state.advancedSettings, state.slippageTolerance),
      destinations,
      use_dca_plus: true,
    },
  };

  if (chain === Chains.Osmosis) {
    return msg as OsmosisExecuteMsg;
  }
  return msg as ExecuteMsg;
}

export function buildCreateVaultParams(
  formType: FormNames,
  state: DcaFormState,
  pairs: Pair[],
  transactionType: TransactionType,
  senderAddress: string,
) {
  if (formType === FormNames.DcaIn || formType === FormNames.DcaOut) {
    return buildCreateVaultParamsDCA(state as DcaInFormDataAll, pairs, transactionType, senderAddress);
  }

  if (formType === FormNames.DcaPlusIn || formType === FormNames.DcaPlusOut) {
    return buildCreateVaultParamsDCAPlus(state as DcaPlusState, pairs, senderAddress);
  }

  throw new Error('Invalid form type');
}
