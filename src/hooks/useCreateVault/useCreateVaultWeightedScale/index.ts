import { useWallet } from '@hooks/useWallet';
import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { Strategy } from '@models/Strategy';
import YesNoValues from '@models/YesNoValues';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { BuildCreateVaultContext } from '../buildCreateVaultParams';
import { useTrackCreateVault } from '../useTrackCreateVault';
import { handleError } from '../handleError';

export const useCreateVaultWeightedScale = () => {
  const { transactionType } = useStrategyInfo();
  const { address } = useWallet();

  const client = useCalcSigningClient();
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
        increaseOnly: state.applyMultiplier === YesNoValues.No,
      },
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
