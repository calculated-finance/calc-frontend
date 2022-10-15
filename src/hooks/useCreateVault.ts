/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

import { useMutation } from '@tanstack/react-query';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import getDenomInfo from '@utils/getDenomInfo';
import TriggerTypes from 'src/models/TriggerTypes';
import usePairs, { Pair } from './usePairs';
import { useConfirmForm } from './useDcaInForm';
import { PositionType } from './useStrategies';
import { AuthorizationType, StakeAuthorization, StakeAuthorization_Validators } from 'cosmjs-types/cosmos/staking/v1beta1/authz'
import {Coin} from 'cosmjs-types/cosmos/base/v1beta1/coin'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'

const useCreateVault = (positionType: PositionType) => {
  const { address: senderAddress, client } = useWallet();
  const { data } = usePairs();

  const { state } = useConfirmForm();

  return useMutation<ExecuteResult, Error>(() => {
    if (!state) {
      throw new Error('No state');
    }

    const {
      quoteDenom,
      baseDenom,
      initialDeposit,
      startDate,
      swapAmount,
      executionInterval,
      purchaseTime,
      slippageTolerance,
      triggerType,
      startPrice,
      advancedSettings,
    } = state;

    // throw error if pair not found
    // TODO: note that we need to make sure pairAddress has been set by the time mutate is called
    // (usePair might not have fetched yet)

    const pairAddress =
      positionType === 'enter'
        ? data?.pairs?.find((pair: Pair) => pair.base_denom === baseDenom && pair.quote_denom === quoteDenom)?.address
        : data?.pairs?.find((pair: Pair) => pair.base_denom === quoteDenom && pair.quote_denom === baseDenom)?.address;

    const { deconversion } = getDenomInfo(quoteDenom);

    let startTimeSeconds;

    if (startDate) {
      const startTime = new Date(startDate);
      if (purchaseTime) {
        const [hours, minutes] = purchaseTime.split(':');
        startTime.setHours(parseInt(hours, 10));
        startTime.setMinutes(parseInt(minutes, 10));
      }
      startTimeSeconds = (startTime.valueOf() / 1000).toString();
    }

    const contractEndpoint =
      triggerType === TriggerTypes.Date // needs to default to date maybe
        ? 'create_vault_with_time_trigger'
        : 'create_vault_with_f_i_n_limit_order_trigger';

    const msg = {
      [contractEndpoint]: {
        time_interval: executionInterval,
        pair_address: pairAddress,
        position_type: positionType,
        swap_amount: deconversion(swapAmount).toString(),
        target_start_time_utc_seconds: startTimeSeconds,
        target_price: startPrice?.toString() || undefined,
        slippage_tolerance: advancedSettings ? slippageTolerance?.toString() : undefined,
      },
    };

    const funds = true
      ? [{ denom: quoteDenom, amount: deconversion(initialDeposit).toString() }]
      : [{ denom: baseDenom, amount: deconversion(initialDeposit).toString() }];

    if (!pairAddress || !client) {
      throw Error('Invalid form data');
    }

    const compounderContractAddress = 'kujira1zkjdvs80vrnq9rp2n6lzunelfnyt0hauwlpph70hls7cdq6u86tsxknl4c'
    
    // https://github.com/confio/cosmjs-types/blob/cae4762f5856efcb32f49ac26b8fdae799a3727a/src/cosmos/staking/v1beta1/authz.ts
    // https://www.npmjs.com/package/cosmjs-types

    let raw = JSON.stringify(msg)
    let enc = new TextEncoder()
    let encoded_msg = enc.encode(raw)

    const contractMsg = MsgExecuteContract.fromPartial({
      contract: CONTRACT_ADDRESS,
      funds: [ Coin.fromPartial({
        amount: funds[0].amount,
        denom: funds[0].denom
      })],
      msg: encoded_msg,
      sender: senderAddress
    })

    const grantMsg = {
      typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
      value: {
        granter: senderAddress,
        grantee: compounderContractAddress,
        grant: {
          authorization: {
            typeUrl: "/cosmos.staking.v1beta1.StakeAuthorization",
            value: StakeAuthorization.encode(
              StakeAuthorization.fromPartial({
                authorizationType: AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
                allowList: StakeAuthorization_Validators.fromPartial({
                  address: [
                    "kujiravaloper1dgpzk55f7jg0s40act0salwewmzeprgqh2c2hh"
                  ]
                })
              }),
            ).finish(),
          },
        },
      },
    };

    console.log(msg)

    const result = client.signAndBroadcast(
      senderAddress,
      [grantMsg, {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: contractMsg
      }],
      'auto',
      'memo'
    )
    //const result2 = client.execute(senderAddress, CONTRACT_ADDRESS, grantMsg, 'auto', undefined, []);
    return result;
  });
};
export default useCreateVault;
