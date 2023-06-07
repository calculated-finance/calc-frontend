/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';
import * as Sentry from '@sentry/react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { isNil } from 'lodash';
import { getChainContractAddress } from '@helpers/chains';
import { EncodeObject } from '@cosmjs/proto-signing';
import { CustomiseSchemaDca } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { TransactionType } from '@components/TransactionType';
import { useChain } from './useChain';
import { Strategy } from './useStrategies';
import { getExecuteMsg } from './useCreateVault/getCreateVaultExecuteMsg';
import { STRATEGY_KEY } from './useStrategy';
import {
  buildWeightedScaleAdjustmentStrategy,
  getExecutionInterval,
  getMinimumReceiveAmount,
  getSlippageTolerance,
} from './useCreateVault/buildCreateVaultParams';
import { useAnalytics } from './useAnalytics';

type ConfigureVariables = {
  values: CustomiseSchemaDca;
  initialValues: CustomiseSchemaDca;
  context: {
    initialDenom: string;
    swapAmount: number;
    resultingDenom: string;
    transactionType: TransactionType;
    currentPrice: number | undefined;
  };
  strategy: Strategy;
};

function getUpdateVaultMessage({ values, initialValues, context, strategy }: ConfigureVariables) {
  const isPriceThresholdDirty = values.priceThresholdValue !== initialValues.priceThresholdValue;
  const isSlippageToleranceDirty = values.slippageTolerance !== initialValues.slippageTolerance;
  const isTimeIntervalDirty =
    values.executionInterval !== initialValues.executionInterval ||
    values.executionIntervalIncrement !== initialValues.executionIntervalIncrement;

  if (context.currentPrice === undefined) {
    throw new Error('Unable to get current price. Please try again.');
  }

  const isWeightedScaleDirty =
    values.applyMultiplier !== initialValues.applyMultiplier ||
    values.basePriceIsCurrentPrice !== initialValues.basePriceIsCurrentPrice ||
    values.swapMultiplier !== initialValues.swapMultiplier ||
    values.applyMultiplier !== initialValues.applyMultiplier;

  const updateVaultMsg = {
    update_vault: {
      vault_id: strategy.id,
      minimum_receive_amount: isPriceThresholdDirty
        ? getMinimumReceiveAmount(
            context.initialDenom,
            context.swapAmount,
            values.priceThresholdValue,
            context.resultingDenom,
            context.transactionType,
          )
        : undefined,
      slippage_tolerance: isSlippageToleranceDirty ? getSlippageTolerance(true, values.slippageTolerance) : undefined,
      time_interval: isTimeIntervalDirty
        ? getExecutionInterval(values.executionInterval, values.executionIntervalIncrement)
        : undefined,
      swap_adjustment_strategy: isWeightedScaleDirty
        ? buildWeightedScaleAdjustmentStrategy(
            context.initialDenom,
            context.swapAmount,
            values.basePriceValue,
            context.resultingDenom,
            context.transactionType,
            values.applyMultiplier,
            values.swapMultiplier,
            context.currentPrice,
          )
        : undefined,
    },
  } as ExecuteMsg;
  return updateVaultMsg;
}

export function useCustomiseStrategy() {
  const { address, signingClient: client } = useWallet();

  const { track } = useAnalytics();

  const { chain } = useChain();

  const queryClient = useQueryClient();
  return useMutation<DeliverTxResponse, Error, ConfigureVariables>(
    (variables) => {
      if (isNil(address)) {
        throw new Error('address is null or empty');
      }
      if (!client) {
        throw new Error('client is null or empty');
      }

      if (isNil(chain)) {
        throw new Error('chain is null or empty');
      }

      if (variables.strategy.owner !== address) {
        throw new Error('You are not the owner of this strategy');
      }

      const msgs: EncodeObject[] = [];

      const updateVaultMsg = getUpdateVaultMessage(variables);

      msgs.push(getExecuteMsg(updateVaultMsg, undefined, address, getChainContractAddress(chain)));

      return client.signAndBroadcast(address, msgs, 'auto');
    },
    {
      onSuccess: (data, variables) => {
        track('Strategy Customisation Updated', { msg: getUpdateVaultMessage(variables) });
        queryClient.invalidateQueries({ queryKey: [STRATEGY_KEY, variables.strategy.id] });
      },
      onError: (error, { values }) => {
        Sentry.captureException(error, { tags: { chain, values: JSON.stringify(values) } });
      },
    },
  );
}
