/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';

import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';

import { useChain } from '@hooks/useChain';
import * as Sentry from '@sentry/react';
import { isNil } from 'lodash';
import { useAnalytics } from '@hooks/useAnalytics';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { Strategy } from '@models/Strategy';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import YesNoValues from '@models/YesNoValues';
import { DcaPlusState } from '@models/dcaPlusFormData';
import useFiatPrice from '@hooks/useFiatPrice';
import { DenomInfo } from '@utils/DenomInfo';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { BuildCreateVaultContext } from './buildCreateVaultParams';

export type UseCreateVaultVariables = {
  createFee: boolean;
  createVaultContext: BuildCreateVaultContext;
  initialDeposit: number;
};

function getSentryCreateVaultTags(createVaultContext: BuildCreateVaultContext) {
  return {
    ...createVaultContext,
    initialDenom: createVaultContext.initialDenom.name,
    resultingDenom: createVaultContext.resultingDenom.name,
    timeInterval: `${createVaultContext.timeInterval.increment} ${createVaultContext.timeInterval.interval}`,
    timeTrigger: `${createVaultContext.timeTrigger?.startDate} ${createVaultContext.timeTrigger?.startTime}`,
    destinationConfig: JSON.stringify(createVaultContext.destinationConfig),
    swapAdjustment: JSON.stringify(createVaultContext.swapAdjustment),
  };
}

function handleError(
  createVaultContext: BuildCreateVaultContext,
): ((reason: any) => PromiseLike<never>) | null | undefined {
  return (error) => {
    if (error instanceof Error) {
      if (!error.message.includes('Request rejected')) {
        Sentry.captureException(error, {
          tags: getSentryCreateVaultTags(createVaultContext),
        });
        throw new Error(error.message);
      }
      throw new Error('Transaction cancelled');
    }
    throw new Error('Unknown error');
  };
}

function useTrackCreateVault() {
  const { chain } = useChain();
  const { formName } = useStrategyInfo();
  const { address: senderAddress } = useWallet();
  const { walletType } = useWallet();
  const { track } = useAnalytics();

  return () => {
    track('Strategy Created', { formName, chain, address: senderAddress, walletType });
  };
}

export const useCreateVaultDca = (initialDenom: DenomInfo | undefined) => {
  const { transactionType } = useStrategyInfo();
  const { chain } = useChain();
  const client = useCalcSigningClient(chain);
  const { address } = useWallet();

  const track = useTrackCreateVault();

  const { price } = useFiatPrice(initialDenom);

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: DcaInFormDataAll | undefined;
      reinvestStrategyData: Strategy | undefined;
    }
  >(({ state, reinvestStrategyData }) => {
    if (!state) {
      throw new Error('No state');
    }

    if (!isNil(state.reinvestStrategy) && !reinvestStrategyData) {
      throw new Error('Invalid reinvest strategy.');
    }

    if (!client) {
      throw Error('Invalid client');
    }

    if (!price) {
      throw Error('Invalid price');
    }

    if (!address) {
      throw new Error('No sender address');
    }

    const createVaultContext: BuildCreateVaultContext = {
      initialDenom: getDenomInfo(state.initialDenom),
      resultingDenom: getDenomInfo(state.resultingDenom),
      timeInterval: { interval: state.executionInterval, increment: state.executionIntervalIncrement },
      timeTrigger: { startDate: state.startDate, startTime: state.purchaseTime },
      startPrice: state.startPrice || undefined,
      swapAmount: state.swapAmount,
      priceThreshold: state.priceThresholdValue || undefined,
      transactionType,
      slippageTolerance: state.slippageTolerance,
      swapAdjustment: undefined,
      performanceAssessmentStrategy: undefined,
      destinationConfig: {
        autoStakeValidator: state.autoStakeValidator || undefined,
        autoCompoundStakingRewards: state.autoCompoundStakingRewards,
        recipientAccount: state.recipientAccount || undefined,
        yieldOption: state.yieldOption || undefined,
        reinvestStrategyId: state.reinvestStrategy || undefined,
        senderAddress: address,
      },
    };

    const fee = createStrategyFeeInTokens(price);

    return client
      .createStrategy(address, state.initialDeposit, fee, createVaultContext)
      .then((result) => {
        track();
        return result;
      })
      .catch(handleError(createVaultContext));
  });
};

export const useCreateVaultDcaPlus = (initialDenom: DenomInfo | undefined) => {
  const { transactionType } = useStrategyInfo();
  const { address } = useWallet();
  const { chain } = useChain();

  const client = useCalcSigningClient(chain);
  const track = useTrackCreateVault();

  const { price } = useFiatPrice(initialDenom);

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: DcaPlusState | undefined;
      reinvestStrategyData: Strategy | undefined;
    }
  >(({ state, reinvestStrategyData }) => {
    if (!client) {
      throw Error('Invalid client');
    }

    if (!state) {
      throw new Error('No state');
    }

    if (!isNil(state.reinvestStrategy) && !reinvestStrategyData) {
      throw new Error('Invalid reinvest strategy.');
    }

    if (!price) {
      throw Error('Invalid price');
    }

    if (!address) {
      throw new Error('No sender address');
    }

    const createVaultContext: BuildCreateVaultContext = {
      initialDenom: getDenomInfo(state.initialDenom),
      resultingDenom: getDenomInfo(state.resultingDenom),
      timeInterval: { interval: 'daily' as ExecutionIntervals, increment: 1 },
      timeTrigger: undefined,
      startPrice: undefined,
      swapAmount: getSwapAmountFromDuration(state.initialDeposit, state.strategyDuration),
      priceThreshold: undefined,
      transactionType,
      slippageTolerance: state.slippageTolerance,
      isDcaPlus: true,
      destinationConfig: {
        autoStakeValidator: state.autoStakeValidator || undefined,
        autoCompoundStakingRewards: state.autoCompoundStakingRewards,
        recipientAccount: state.recipientAccount || undefined,
        yieldOption: state.yieldOption || undefined,
        reinvestStrategyId: state.reinvestStrategy || undefined,
        senderAddress: address,
      },
    };
    const fee = createStrategyFeeInTokens(price);

    return client
      .createStrategy(address, state.initialDeposit, fee, createVaultContext)
      .then((result) => {
        track();
        return result;
      })
      .catch(handleError(createVaultContext));
  });
};

export const useCreateVaultWeightedScale = () => {
  const { transactionType } = useStrategyInfo();
  const { address } = useWallet();

  const { chain } = useChain();

  const client = useCalcSigningClient(chain);
  const track = useTrackCreateVault();

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: WeightedScaleState | undefined;
      dexPrice: number | undefined;
      reinvestStrategyData: Strategy | undefined;
    }
  >(({ state, dexPrice, reinvestStrategyData }) => {
    if (!client) {
      throw Error('Invalid client');
    }

    if (!dexPrice) {
      throw new Error('No dex price');
    }

    if (!state) {
      throw new Error('No state');
    }

    if (!address) {
      throw new Error('No sender address');
    }

    if (Boolean(state.reinvestStrategy) && !reinvestStrategyData) {
      throw new Error('Invalid reinvest strategy.');
    }

    const createVaultContext: BuildCreateVaultContext = {
      initialDenom: getDenomInfo(state.initialDenom),
      resultingDenom: getDenomInfo(state.resultingDenom),
      timeInterval: { interval: state.executionInterval, increment: state.executionIntervalIncrement },
      timeTrigger: { startDate: state.startDate, startTime: state.purchaseTime },
      startPrice: state.startPrice || undefined,
      swapAmount: state.swapAmount,
      priceThreshold: state.priceThresholdValue || undefined,
      transactionType,
      slippageTolerance: state.slippageTolerance,
      swapAdjustment: {
        basePrice: state.basePriceValue || dexPrice,
        swapMultiplier: state.swapMultiplier,
        applyMultiplier: state.applyMultiplier === YesNoValues.Yes,
      },
      isDcaPlus: false,
      destinationConfig: {
        autoStakeValidator: state.autoStakeValidator || undefined,
        autoCompoundStakingRewards: state.autoCompoundStakingRewards,
        recipientAccount: state.recipientAccount || undefined,
        yieldOption: state.yieldOption || undefined,
        reinvestStrategyId: state.reinvestStrategy || undefined,
        senderAddress: address,
      },
    };

    return client
      .createStrategy(address, state.initialDeposit, undefined, createVaultContext)
      .then((result) => {
        track();
        return result;
      })
      .catch(handleError(createVaultContext));
  });
};
