/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';
import * as Sentry from '@sentry/react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { isNil } from 'lodash';
import { getChainContractAddress } from '@helpers/chains';
import { EncodeObject } from '@cosmjs/proto-signing';
import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { TransactionType } from '@components/TransactionType';
import {
  CustomiseSchema,
  CustomiseSchemaDca,
  CustomiseSchemaWeightedScale,
} from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { DenomInfo } from '@utils/DenomInfo';
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
  values: CustomiseSchema;
  initialValues: CustomiseSchema;
  context: {
    initialDenom: DenomInfo;
    swapAmount: number;
    resultingDenom: DenomInfo;
    transactionType: TransactionType;
    currentPrice: number | undefined;
  };
  strategy: Strategy;
};

function buildTimeInterval({ values, initialValues, context, strategy }: ConfigureVariables) {
  if (!isDcaPlus(strategy)) {
    const castedValues = values as CustomiseSchemaDca | CustomiseSchemaWeightedScale;
    const castedInvitialValues = initialValues as CustomiseSchemaDca | CustomiseSchemaWeightedScale;
    const isTimeIntervalDirty =
      castedValues.executionInterval !== castedInvitialValues.executionInterval ||
      castedValues.executionIntervalIncrement !== castedInvitialValues.executionIntervalIncrement;

    if (isTimeIntervalDirty) {
      return {
        time_interval: getExecutionInterval(castedValues.executionInterval, castedValues.executionIntervalIncrement),
      };
    }
  }
  return {};
}

function buildPriceThreshold({ values, initialValues, context, strategy }: ConfigureVariables) {
  const isPriceThresholdDirty = values.priceThresholdValue !== initialValues.priceThresholdValue;

  if (isPriceThresholdDirty) {
    return {
      minimum_receive_amount: getMinimumReceiveAmount(
        context.initialDenom,
        context.swapAmount,
        values.priceThresholdValue,
        context.resultingDenom,
        context.transactionType,
      ),
    };
  }
  return {};
}

function buildSlippageTolerance({ values, initialValues, context, strategy }: ConfigureVariables) {
  const isSlippageToleranceDirty = values.slippageTolerance !== initialValues.slippageTolerance;
  if (isSlippageToleranceDirty) {
    return {
      slippage_tolerance: getSlippageTolerance(true, values.slippageTolerance),
    };
  }
  return {};
}

function buildSwapAdjustmentStrategy({ values, initialValues, context, strategy }: ConfigureVariables) {
  if (!isWeightedScale(strategy)) {
    return {};
  }

  if (context.currentPrice === undefined) {
    throw new Error('Unable to get current price. Please try again.');
  }

  const castedValues = values as CustomiseSchemaWeightedScale;
  const castedInvitialValues = initialValues as CustomiseSchemaWeightedScale;
  const isWeightedScaleDirty =
    castedValues.applyMultiplier !== castedInvitialValues.applyMultiplier ||
    castedValues.basePriceIsCurrentPrice !== castedInvitialValues.basePriceIsCurrentPrice ||
    castedValues.basePriceValue !== castedInvitialValues.basePriceValue ||
    castedValues.swapMultiplier !== castedInvitialValues.swapMultiplier ||
    castedValues.applyMultiplier !== castedInvitialValues.applyMultiplier;

  if (isWeightedScaleDirty) {
    return {
      swap_adjustment_strategy: buildWeightedScaleAdjustmentStrategy(
        context.initialDenom,
        context.swapAmount,
        castedValues.basePriceValue,
        context.resultingDenom,
        context.transactionType,
        castedValues.applyMultiplier,
        castedValues.swapMultiplier,
        context.currentPrice,
      ),
    };
  }
  return {};
}

function getUpdateVaultMessage(variables: ConfigureVariables) {
  const updateVaultMsg = {
    update_vault: {
      vault_id: variables.strategy.id,
      ...buildPriceThreshold(variables),
      ...buildSlippageTolerance(variables),
      ...buildTimeInterval(variables),
      ...buildSwapAdjustmentStrategy(variables),
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
      console.log('variables', variables);
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
