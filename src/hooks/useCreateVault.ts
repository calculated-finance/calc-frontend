/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@wizard-ui/react';
import {
  STAKING_ROUTER_CONTRACT_ADDRESS,
  CONTRACT_ADDRESS,
  CREATE_VAULT_FEE,
  ONE_MILLION,
  OUT_OF_GAS_ERROR_MESSAGE,
  LEDGER_AUTHZ_NOT_INCLUDED_ERROR_MESSAGE,
} from 'src/constants';

import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { MsgGrant } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { Event } from '@cosmjs/stargate/build/events';
import { Timestamp } from 'cosmjs-types/google/protobuf/timestamp';
import { Destination, ExecuteMsg } from 'src/interfaces/generated/execute';
import { DcaInFormDataAll, initialValues } from '@models/DcaInFormData';
import { TransactionType } from '@components/TransactionType';
import { EncodeObject } from '@cosmjs/proto-signing';
import { getFeeMessage } from 'src/helpers/getFeeMessage';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { Denom } from '@models/Denom';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import usePairs from './usePairs';
import { Pair } from '../models/Pair';
import { FormNames, useConfirmForm } from './useDcaInForm';
import { Strategy } from './useStrategies';
import { combineDateAndTime } from '../helpers/combineDateAndTime';
import { findPair } from '../helpers/findPair';
import useFiatPrice from './useFiatPrice';
import { useDcaPlusConfirmForm } from './useDcaPlusForm';

function getSlippageWithoutTrailingZeros(slippage: number) {
  return parseFloat((slippage / 100).toFixed(4)).toString();
}

function getReceiveAmount(
  price: number | null | undefined,
  deconversion: (value: number) => number,
  swapAmount: number,
  transactionType: TransactionType,
) {
  if (!price) {
    return undefined;
  }

  if (transactionType === TransactionType.Buy) {
    return deconversion(Number((swapAmount / price).toFixed(2))).toString();
  }
  return deconversion(swapAmount * price).toString();
}

function encodeMsg(createVaultExecuteMsg: ExecuteMsg) {
  const raw = JSON.stringify(createVaultExecuteMsg);
  const textEncoder = new TextEncoder();
  const encoded_msg = textEncoder.encode(raw);
  return encoded_msg;
}

function getDestinations(state: DcaInFormDataAll) {
  const { autoStakeValidator, recipientAccount } = state;
  const destinations = [] as Destination[];

  if (autoStakeValidator) {
    destinations.push({ address: autoStakeValidator, allocation: '1', action: 'z_delegate' });
  }

  if (recipientAccount) {
    destinations.push({ address: recipientAccount, allocation: '1', action: 'send' });
  }

  return destinations.length ? destinations : undefined;
}

function getFunds(state: DcaInFormDataAll) {
  const { initialDenom, initialDeposit } = state;
  const { deconversion } = getDenomInfo(initialDenom);
  const funds = [{ denom: initialDenom, amount: deconversion(initialDeposit).toString() }];

  const fundsInCoin = [
    Coin.fromPartial({
      amount: funds[0].amount,
      denom: funds[0].denom,
    }),
  ];
  return fundsInCoin;
}

function getMinimumReceiveAmount(state: DcaInFormDataAll, transactionType: TransactionType) {
  const { initialDenom, swapAmount, priceThresholdValue, resultingDenom } = state;
  const { priceConversion } =
    transactionType === TransactionType.Buy ? getDenomInfo(resultingDenom) : getDenomInfo(initialDenom);

  const { deconversion } = getDenomInfo(initialDenom);
  return getReceiveAmount(priceConversion(priceThresholdValue), deconversion, swapAmount, transactionType);
}

function getSlippageTolerance(state: DcaInFormDataAll): string | null | undefined {
  const { advancedSettings, slippageTolerance } = state;
  return advancedSettings && slippageTolerance
    ? getSlippageWithoutTrailingZeros(slippageTolerance)
    : getSlippageWithoutTrailingZeros(initialValues.slippageTolerance);
}

function getPairAddress(state: DcaInFormDataAll, pairs: Pair[]) {
  const { initialDenom, resultingDenom } = state;
  const pairAddress = findPair(pairs, resultingDenom, initialDenom);

  if (!pairAddress) {
    throw new Error('Pair not found');
  }
  return pairAddress;
}

function getStartTime(state: DcaInFormDataAll) {
  const { startDate, purchaseTime } = state;
  let startTimeSeconds;

  if (startDate) {
    const startTime = combineDateAndTime(startDate, purchaseTime);
    startTimeSeconds = (startTime.valueOf() / 1000).toString();
  }
  return startTimeSeconds;
}

function getTargetReceiveAmount(state: DcaInFormDataAll, transactionType: TransactionType) {
  const { initialDenom, swapAmount, startPrice, resultingDenom } = state;
  const { priceConversion } =
    transactionType === TransactionType.Buy ? getDenomInfo(resultingDenom) : getDenomInfo(initialDenom);

  const { deconversion } = getDenomInfo(initialDenom);
  return getReceiveAmount(priceConversion(startPrice), deconversion, swapAmount, transactionType);
}

function getSwapAmount(state: DcaInFormDataAll) {
  const { initialDenom, swapAmount } = state;
  const { deconversion } = getDenomInfo(initialDenom);

  return deconversion(swapAmount).toString();
}

function getExecutionInterval(state: DcaInFormDataAll) {
  const { executionInterval } = state;
  return executionInterval;
}

function buildCreateVaultParams(
  state: DcaInFormDataAll,
  pairs: Pair[],
  transactionType: TransactionType,
  dcaPlus = undefined,
): ExecuteMsg {
  return {
    create_vault: {
      label: '',
      time_interval: getExecutionInterval(state),
      pair_address: getPairAddress(state, pairs),
      swap_amount: getSwapAmount(state),
      target_start_time_utc_seconds: getStartTime(state),
      minimum_receive_amount: getMinimumReceiveAmount(state, transactionType),
      slippage_tolerance: getSlippageTolerance(state),
      destinations: getDestinations(state),
      target_receive_amount: getTargetReceiveAmount(state, transactionType),
      use_dca_plus: dcaPlus,
    },
  };
}

function getCreateVaultExecuteMsg(
  msg: ExecuteMsg,
  funds: Coin[],
  senderAddress: string,
): { typeUrl: string; value: MsgExecuteContract } {
  const encoded_msg = encodeMsg(msg);

  const msgExecuteContract = MsgExecuteContract.fromPartial({
    contract: CONTRACT_ADDRESS,
    funds,
    msg: encoded_msg,
    sender: senderAddress,
  });

  const protobufMsg = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: msgExecuteContract,
  };

  return protobufMsg;
}

function getGrantMsg(senderAddress: string): { typeUrl: string; value: MsgGrant } {
  // https://github.com/confio/cosmjs-types/blob/cae4762f5856efcb32f49ac26b8fdae799a3727a/src/cosmos/staking/v1beta1/authz.ts
  // https://www.npmjs.com/package/cosmjs-types
  const secondsInOneYear = 31536000;
  return {
    typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
    value: {
      granter: senderAddress,
      grantee: STAKING_ROUTER_CONTRACT_ADDRESS,
      grant: {
        authorization: {
          typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
          value: GenericAuthorization.encode(
            GenericAuthorization.fromPartial({
              msg: '/cosmos.staking.v1beta1.MsgDelegate',
            }),
          ).finish(),
        },
        expiration: Timestamp.fromPartial({
          seconds: new Date().getTime() / 1000 + secondsInOneYear,
          nanos: 0,
        }),
      },
    } as MsgGrant,
  };
}

function getStrategyIdFromEvents(events: readonly Event[]) {
  return events.find((event) => event.type === 'wasm')?.attributes.find((attribute) => attribute.key === 'vault_id')
    ?.value;
}

function getVaultIdFromDeliverTxResponse(data: DeliverTxResponse) {
  const { events } = data;
  if (!events) {
    throw new Error('No events');
  }

  const id = getStrategyIdFromEvents(events);

  if (!id) {
    throw new Error('No id found');
  }
  return id;
}

export function createStrategyFeeInTokens(price: any) {
  return ((CREATE_VAULT_FEE / price) * ONE_MILLION).toFixed(0);
}

function executeCreateVault(client: SigningCosmWasmClient, senderAddress: any, msgs: EncodeObject[]): Promise<string> {
  return client
    .signAndBroadcast(senderAddress, msgs, 'auto')
    .then((data) => {
      try {
        return getVaultIdFromDeliverTxResponse(data);
      } catch (error) {
        throw data.rawLog ? new Error(data.rawLog) : error;
      }
    })
    .catch((error) => {
      const errorMessages: Record<string, string> = {
        'out of gas': OUT_OF_GAS_ERROR_MESSAGE,
        "Type URL '/cosmos.authz.v1beta1.MsgGrant' does not exist in the Amino message type register":
          LEDGER_AUTHZ_NOT_INCLUDED_ERROR_MESSAGE,
      };
      const matchingErrorKey = Object.keys(errorMessages).find((key) => error.toString().includes(key));
      throw new Error(matchingErrorKey ? errorMessages[matchingErrorKey] : error);
    });
}

const useCreateVault = (formName: FormNames, transactionType: TransactionType) => {
  const msgs: EncodeObject[] = [];
  const { address: senderAddress, signingClient: client } = useWallet();
  const { data: pairsData } = usePairs();

  const { state } = useConfirmForm(formName);
  const { price } = useFiatPrice(state?.initialDenom as Denom);

  return useMutation<Strategy['id'], Error>(() => {
    if (!state) {
      throw new Error('No state');
    }

    if (!price) {
      throw new Error('No fiat price');
    }

    if (!client) {
      throw Error('Invalid client');
    }

    const { pairs } = pairsData || {};

    if (!pairs) {
      throw Error('No pairs found');
    }

    const { autoStakeValidator } = state;

    if (autoStakeValidator) {
      msgs.push(getGrantMsg(senderAddress));
    }

    const createVaultMsg = buildCreateVaultParams(state, pairs, transactionType);
    const funds = getFunds(state);

    msgs.push(getCreateVaultExecuteMsg(createVaultMsg, funds, senderAddress));

    const tokensToCoverFee = createStrategyFeeInTokens(price);
    msgs.push(getFeeMessage(senderAddress, state.initialDenom, tokensToCoverFee));

    return executeCreateVault(client, senderAddress, msgs);
  });
};

export const useCreateVaultDcaPlus = (formName: FormNames, transactionType: TransactionType) => {
  const msgs: EncodeObject[] = [];
  const { address: senderAddress, signingClient: client } = useWallet();
  const { data: pairsData } = usePairs();

  const { state } = useDcaPlusConfirmForm(formName);
  const { price } = useFiatPrice(state?.initialDenom as Denom);

  return useMutation<Strategy['id'], Error>(() => {
    if (!state) {
      throw new Error('No state');
    }

    if (!price) {
      throw new Error('No fiat price');
    }

    if (!client) {
      throw Error('Invalid client');
    }

    const { pairs } = pairsData || {};

    if (!pairs) {
      throw Error('No pairs found');
    }

    const { autoStakeValidator } = state;

    if (autoStakeValidator) {
      msgs.push(getGrantMsg(senderAddress));
    }

    const createVaultMsg = buildCreateVaultParams(
      { swapAmount: 1, executionInterval: 'daily', ...state },
      pairs,
      transactionType,
    );
    const funds = getFunds(state);

    msgs.push(getCreateVaultExecuteMsg(createVaultMsg, funds, senderAddress));

    const tokensToCoverFee = createStrategyFeeInTokens(price);
    msgs.push(getFeeMessage(senderAddress, state.initialDenom, tokensToCoverFee));

    return executeCreateVault(client, senderAddress, msgs);
  });
};

export default useCreateVault;
