/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@wizard-ui/react';

import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { TransactionType } from '@components/TransactionType';
import { EncodeObject } from '@cosmjs/proto-signing';
import { getFeeMessage } from '@helpers/getFeeMessage';
import { Denom } from '@models/Denom';
import { useDcaPlusConfirmForm } from '@hooks/useDcaPlusForm';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import usePairs from '../usePairs';
import { FormNames, useConfirmForm } from '../useDcaInForm';
import { Strategy } from '../useStrategies';
import useFiatPrice from '../useFiatPrice';
import { getGrantMsg } from './getGrantMsg';
import { getCreateVaultExecuteMsg } from './getCreateVaultExecuteMsg';
import { buildCreateVaultParams } from './buildCreateVaultParams';
import { executeCreateVault } from './executeCreateVault';
import { DcaFormState } from './DcaFormState';

function getFunds(initialDenom: Denom, initialDeposit: number) {
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

const useCreateVault = (formName: FormNames, transactionType: TransactionType, state: DcaFormState | undefined) => {
  const msgs: EncodeObject[] = [];
  const { address: senderAddress, signingClient: client } = useWallet();
  const { data: pairsData } = usePairs();

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

    const createVaultMsg = buildCreateVaultParams(formName, state, pairs, transactionType);

    const funds = getFunds(state.initialDenom, state.initialDeposit);

    msgs.push(getCreateVaultExecuteMsg(createVaultMsg, funds, senderAddress));

    const tokensToCoverFee = createStrategyFeeInTokens(price);
    msgs.push(getFeeMessage(senderAddress, state.initialDenom, tokensToCoverFee));

    return executeCreateVault(client, senderAddress, msgs);
  });
};

export const useCreateVaultDca = (formName: FormNames, transactionType: TransactionType) => {
  const { state } = useConfirmForm(formName);

  return useCreateVault(formName, transactionType, state);
};

export const useCreateVaultDcaPlus = (formName: FormNames, transactionType: TransactionType) => {
  const { state } = useDcaPlusConfirmForm(formName);

  return useCreateVault(formName, transactionType, state);
};
