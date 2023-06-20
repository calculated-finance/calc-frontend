/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';

import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { EncodeObject } from '@cosmjs/proto-signing';
import { getFeeMessage } from '@helpers/getFeeMessage';

import { useDcaPlusConfirmForm } from '@hooks/useDcaPlusForm';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { useChain } from '@hooks/useChain';
import { getChainContractAddress, getChainFeeTakerAddress } from '@helpers/chains';
import { useWeightedScaleConfirmForm } from '@hooks/useWeightedScaleForm';
import usePrice from '@hooks/usePrice';
import * as Sentry from '@sentry/react';
import useStrategy from '@hooks/useStrategy';
import { isNil } from 'lodash';
import { useAnalytics } from '@hooks/useAnalytics';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { Chains } from '@hooks/useChain/Chains';
import { Denom } from '@models/Denom';
import { Strategy } from '@hooks/useStrategies';
import { useConfig } from '@hooks/useConfig';
import usePairs from '../usePairs';
import { useConfirmForm } from '../useDcaInForm';
import { getGrantMsg } from './getGrantMsg';
import { getExecuteMsg } from './getCreateVaultExecuteMsg';
import { buildCreateVaultParams } from './buildCreateVaultParams';
import { executeCreateVault } from './executeCreateVault';
import { DcaFormState } from './DcaFormState';
import { useMoonbeamCreateVault } from './useMoonbeamCreateVault';

function getFunds(initialDenom: Denom, initialDeposit: number) {
  const { deconversion } = getDenomInfo(initialDenom);
  const funds = [{ denom: initialDenom, amount: BigInt(deconversion(initialDeposit)).toString() }];

  const fundsInCoin = [
    Coin.fromPartial({
      amount: funds[0].amount,
      denom: funds[0].denom,
    }),
  ];
  return fundsInCoin;
}

const useCreateVault = (
  state: DcaFormState | undefined,
  excludeCreationFee: boolean,
  dexPrice?: number | undefined,
) => {
  const msgs: EncodeObject[] = [];
  const { address: senderAddress, signingClient: client } = useWallet();
  const { data: pairsData } = usePairs();
  const { chain } = useChain();
  const config = useConfig();

  const { formName, transactionType } = useStrategyInfo();

  const { walletType } = useWallet();

  const { data: reinvestStrategyData } = useStrategy(state?.reinvestStrategy || undefined);

  const { track } = useAnalytics();

  const evmCreate = useMoonbeamCreateVault(state);

  const cosmosCreate = useMutation<Strategy['id'] | undefined, Error, { price: number | undefined }>(
    ({ price }) => {
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

      if (!config) {
        throw new Error('Config not loaded');
      }

      const { autoStakeValidator } = state;

      if (autoStakeValidator) {
        msgs.push(getGrantMsg(senderAddress, chain));
      }

      const createVaultMsg = buildCreateVaultParams(
        formName,
        state,
        transactionType,
        senderAddress,
        dexPrice,
        chain,
        config,
      );

      const funds = getFunds(state.initialDenom, state.initialDeposit);

      msgs.push(getExecuteMsg(createVaultMsg, funds, senderAddress, getChainContractAddress(chain)));

      if (!excludeCreationFee) {
        const tokensToCoverFee = createStrategyFeeInTokens(price);
        msgs.push(getFeeMessage(senderAddress, state.initialDenom, tokensToCoverFee, getChainFeeTakerAddress(chain)));
      }

      return executeCreateVault(client, senderAddress, msgs).then((res) => {
        track('Strategy Created', { formName, chain, address: senderAddress, walletType });
        return res;
      });
    },
    {
      onError: (error) => {
        if (error.message.includes('Request rejected')) {
          return;
        }
        Sentry.captureException(error, { tags: { chain, formName, ...state } });
      },
    },
  );

  return chain === Chains.Moonbeam ? evmCreate : cosmosCreate;
};

export const useCreateVaultDca = () => {
  const { state } = useConfirmForm();

  return useCreateVault(state, false);
};

export const useCreateVaultDcaPlus = () => {
  const { state } = useDcaPlusConfirmForm();

  return useCreateVault(state, false);
};

export const useCreateVaultWeightedScale = () => {
  const { state } = useWeightedScaleConfirmForm();

  const { transactionType } = useStrategyInfo();

  const enablePriceCheck = isNil((state as WeightedScaleState)?.basePriceValue);
  const { price: dexPrice } = usePrice(
    state && getDenomInfo(state.resultingDenom),
    state && getDenomInfo(state.initialDenom),
    transactionType,
    enablePriceCheck,
  );

  return useCreateVault(state, true, dexPrice);
};
