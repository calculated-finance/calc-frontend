/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@wizard-ui/react';
import { STAKING_ROUTER_CONTRACT_ADDRESS, CONTRACT_ADDRESS } from 'src/constants';

import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { MsgGrant } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { Log } from '@cosmjs/stargate/build/logs';
import { Timestamp } from 'cosmjs-types/google/protobuf/timestamp';
import { Destination, ExecuteMsg } from 'src/interfaces/generated/execute';
import { DcaInFormDataAll, initialValues } from '@models/DcaInFormData';
import { TransactionType } from '@components/TransactionType';
import usePairs from './usePairs';
import { Pair } from '../models/Pair';
import { FormNames, useConfirmForm } from './useDcaInForm';
import { Strategy } from './useStrategies';
import { combineDateAndTime } from '../helpers/combineDateAndTime';
import { findPair } from '../helpers/findPair';

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
    return Math.floor(deconversion(swapAmount / price)).toString();
  }
  return Math.floor(deconversion(swapAmount * price)).toString();
}

function getMessageAndFunds(
  state: DcaInFormDataAll,
  pairs: Pair[],
  transactionType: TransactionType,
): { msg: ExecuteMsg; funds: Coin[] } {
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

  const { deconversion } = getDenomInfo(initialDenom);

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

  console.log(priceThresholdValue);
  const minimumReceiveAmount = getReceiveAmount(priceThresholdValue, deconversion, swapAmount, transactionType);
  const targetReceiveAmount = getReceiveAmount(startPrice, deconversion, swapAmount, transactionType);
  const msg = {
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

  return { msg, funds };
}

function getStrategyIdFromLog(log: Log) {
  return log.events.find((event) => event.type === 'wasm')?.attributes.find((attribute) => attribute.key === 'vault_id')
    ?.value;
}

const useCreateVault = (formName: FormNames, transactionType: TransactionType) => {
  const { address: senderAddress, signingClient: client } = useWallet();
  const { data: pairsData } = usePairs();

  const { state } = useConfirmForm(formName);

  return useMutation<Strategy['id'], Error>(() => {
    if (!state) {
      throw new Error('No state');
    }

    if (!client) {
      throw Error('Invalid client');
    }

    const { pairs } = pairsData || {};

    if (!pairs) {
      throw Error('No pairs found');
    }

    const { msg, funds } = getMessageAndFunds(state, pairs, transactionType);
    const { autoStakeValidator } = state;

    if (autoStakeValidator) {
      // https://github.com/confio/cosmjs-types/blob/cae4762f5856efcb32f49ac26b8fdae799a3727a/src/cosmos/staking/v1beta1/authz.ts
      // https://www.npmjs.com/package/cosmjs-types

      const raw = JSON.stringify(msg);
      const enc = new TextEncoder();
      const encoded_msg = enc.encode(raw);

      const contractMsg = MsgExecuteContract.fromPartial({
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

      const secondsInOneYear = 31536000;

      const grantMsg = {
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

      const result = client.signAndBroadcast(
        senderAddress,
        [
          grantMsg,
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: contractMsg,
          },
        ],
        'auto',
        'memo',
      );
      return result.then((data) => {
        const { rawLog } = data;
        if (!rawLog) {
          throw new Error('No raw log');
        }

        const parsedLogs = JSON.parse(rawLog);
        const [, log] = parsedLogs as Log[];
        const id = getStrategyIdFromLog(log);

        if (!id) {
          throw new Error('No id found');
        }
        return id;
      });
    }
    const result = client.execute(senderAddress, CONTRACT_ADDRESS, msg, 'auto', undefined, funds);
    return result.then((data) => {
      const [log] = data.logs;
      const id = getStrategyIdFromLog(log);

      if (!id) {
        throw new Error('No id found');
      }
      return id;
    });
  });
};

export default useCreateVault;
