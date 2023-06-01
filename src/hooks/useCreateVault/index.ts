/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';

import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { TransactionType } from '@components/TransactionType';
import { EncodeObject } from '@cosmjs/proto-signing';
import { getFeeMessage } from '@helpers/getFeeMessage';
import { Denom } from '@models/Denom';
import { useDcaPlusConfirmForm } from '@hooks/useDcaPlusForm';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { useChain } from '@hooks/useChain';
import { getChainContractAddress, getChainFeeTakerAddress } from '@helpers/chains';
import { FormNames } from '@hooks/useFormStore';
import { useWeightedScaleConfirmForm } from '@hooks/useWeightedScaleForm';
import usePrice from '@hooks/usePrice';
import * as Sentry from '@sentry/react';
import useStrategy from '@hooks/useStrategy';
import { isNil } from 'lodash';
import { useAnalytics } from '@hooks/useAnalytics';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import usePairs from '../usePairs';
import { useConfirmForm } from '../useDcaInForm';
import { Strategy } from '../useStrategies';
import useFiatPrice from '../useFiatPrice';
import { getGrantMsg } from './getGrantMsg';
import { getExecuteMsg } from './getCreateVaultExecuteMsg';
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

const useCreateVault = (
  formName: FormNames,
  transactionType: TransactionType,
  state: DcaFormState | undefined,
  excludeCreationFee: boolean,
) => {
  const msgs: EncodeObject[] = [];
  const { address: senderAddress, signingClient: client } = useWallet();
  const { data: pairsData } = usePairs();
  const { chain } = useChain();

  const { data: reinvestStrategyData } = useStrategy(state?.reinvestStrategy || undefined);

  const enablePriceCheck =
    formName === (FormNames.WeightedScaleIn || formName === FormNames.WeightedScaleOut) &&
    isNil((state as WeightedScaleState)?.basePriceValue);

  const { price } = useFiatPrice(state?.initialDenom as Denom);
  const { price: dexPrice } = usePrice(state?.resultingDenom, state?.initialDenom, transactionType, enablePriceCheck);
  const { track } = useAnalytics();

  return useMutation<Strategy['id'], Error>(
    () => {
      if (!state) {
        throw new Error('No state');
      }

      if (!price) {
        throw new Error('No fiat price');
      }

      if (!client) {
        throw Error('Invalid client');
      }

      if (!chain) {
        throw Error('Invalid chain');
      }

      if (!senderAddress) {
        throw Error('Invalid sender address');
      }

      const { pairs } = pairsData || {};

      if (!pairs) {
        throw Error('No pairs found');
      }

      if (!price) {
        throw Error('No price data found');
      }

      if (!isNil(state.reinvestStrategy) && !reinvestStrategyData) {
        throw new Error('Invalid reinvest strategy.');
      }

      if (reinvestStrategyData && reinvestStrategyData.vault.owner !== senderAddress) {
        throw new Error('Reinvest strategy does not belong to user.');
      }

      const { autoStakeValidator } = state;

      if (autoStakeValidator) {
        msgs.push(getGrantMsg(senderAddress, chain));
      }

      const createVaultMsg = buildCreateVaultParams(formName, state, pairs, transactionType, senderAddress, dexPrice);

      const funds = getFunds(state.initialDenom, state.initialDeposit);

      msgs.push(getExecuteMsg(createVaultMsg, funds, senderAddress, getChainContractAddress(chain)));

      if (!excludeCreationFee) {
        const tokensToCoverFee = createStrategyFeeInTokens(price);
        msgs.push(getFeeMessage(senderAddress, state.initialDenom, tokensToCoverFee, getChainFeeTakerAddress(chain)));
      }

      return executeCreateVault(client, senderAddress, msgs).then((res) => {
        track('Strategy Created', { formName, chain });
        return res;
      });
    },
    {
      onError: (error) => {
        Sentry.captureException(error, { tags: { chain, formName, state: JSON.stringify(state) } });
      },
    },
  );
};

export const useCreateVaultDca = (formName: FormNames, transactionType: TransactionType) => {
  const { state } = useConfirmForm(formName);

  return useCreateVault(formName, transactionType, state, false);
};

export const useCreateVaultDcaPlus = (formName: FormNames, transactionType: TransactionType) => {
  const { state } = useDcaPlusConfirmForm(formName);

  return useCreateVault(formName, transactionType, state, false);
};

export const useCreateVaultWeightedScale = (formName: FormNames, transactionType: TransactionType) => {
  const { state } = useWeightedScaleConfirmForm(formName);

  return useCreateVault(formName, transactionType, state, true);
};
