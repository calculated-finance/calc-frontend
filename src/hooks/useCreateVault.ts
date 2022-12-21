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
import usePairs from './usePairs';
import { Pair } from '../models/Pair';
import { FormNames, useConfirmForm } from './useDcaInForm';
import { Strategy } from './useStrategies';
import { combineDateAndTime } from '../helpers/combineDateAndTime';
import { findPair } from '../helpers/findPair';
import useFiatPrice from './useFiatPrice';

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

function getCreateVaultExecuteMsg(
  state: DcaInFormDataAll,
  pairs: Pair[],
  transactionType: TransactionType,
  senderAddress: string,
): { typeUrl: string; value: MsgExecuteContract } {
  const {
    initialDenom,
    resultingDenom,
    initialDeposit,
    startDate,
    swapAmount,
    executionInterval,
    purchaseTime,
    slippageTolerance,
    startPrice,
    advancedSettings,
    recipientAccount,
    autoStakeValidator,
    priceThresholdValue,
  } = state;

  // throw error if pair not found
  // TODO: note that we need to make sure pairAddress has been set by the time mutate is called
  // (usePair might not have fetched yet)

  const pairAddress = findPair(pairs, resultingDenom, initialDenom);

  if (!pairAddress) {
    throw new Error('Pair not found');
  }

  // 1000000 / (769230769230769 ) = 129.87012987012987

  const { deconversion } = getDenomInfo(initialDenom);
  const { priceConversion } =
    transactionType === TransactionType.Buy ? getDenomInfo(resultingDenom) : getDenomInfo(initialDenom);

  let startTimeSeconds;

  if (startDate) {
    const startTime = combineDateAndTime(startDate, purchaseTime);
    startTimeSeconds = (startTime.valueOf() / 1000).toString();
  }

  const destinations = [] as Destination[];

  if (autoStakeValidator) {
    destinations.push({ address: autoStakeValidator, allocation: '1', action: 'z_delegate' });
  }

  if (recipientAccount) {
    destinations.push({ address: recipientAccount, allocation: '1', action: 'send' });
  }

  const minimumReceiveAmount = getReceiveAmount(
    priceConversion(priceThresholdValue),
    deconversion,
    swapAmount,
    transactionType,
  );
  const targetReceiveAmount = getReceiveAmount(priceConversion(startPrice), deconversion, swapAmount, transactionType);
  const createVaultExecuteMsg = {
    create_vault: {
      label: '',
      time_interval: executionInterval,
      pair_address: pairAddress,
      swap_amount: deconversion(swapAmount).toString(),
      target_start_time_utc_seconds: startTimeSeconds,
      minimum_receive_amount: minimumReceiveAmount,
      slippage_tolerance:
        advancedSettings && slippageTolerance
          ? getSlippageWithoutTrailingZeros(slippageTolerance)
          : getSlippageWithoutTrailingZeros(initialValues.slippageTolerance),
      destinations: destinations.length ? destinations : undefined,
      target_receive_amount: targetReceiveAmount,
    },
  } as ExecuteMsg;
  const funds = [{ denom: initialDenom, amount: deconversion(initialDeposit).toString() }];

  console.log(createVaultExecuteMsg);

  const raw = JSON.stringify(createVaultExecuteMsg);
  const textEncoder = new TextEncoder();
  const encoded_msg = textEncoder.encode(raw);

  const msgExecuteContract = MsgExecuteContract.fromPartial({
    contract: CONTRACT_ADDRESS,
    funds: [
      Coin.fromPartial({
        amount: funds[0].amount,
        denom: funds[0].denom,
      }),
    ],
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

    msgs.push(getCreateVaultExecuteMsg(state, pairs, transactionType, senderAddress));

    const tokensToCoverFee = createStrategyFeeInTokens(price);
    msgs.push(getFeeMessage(senderAddress, state.initialDenom, tokensToCoverFee));

    const result = client.signAndBroadcast(senderAddress, msgs, 'auto');

    return result
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
  });
};

export default useCreateVault;
