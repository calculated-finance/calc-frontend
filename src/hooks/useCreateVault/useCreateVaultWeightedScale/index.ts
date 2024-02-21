import { useWallet } from '@hooks/useWallet';
import { useMutation } from '@tanstack/react-query';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { useStrategyInfo } from '@hooks/useStrategyInfo';
import { Strategy } from '@models/Strategy';
import useFiatPrice from '@hooks/useFiatPrice';
import { checkSwapAmountValue } from '@helpers/checkSwapAmountValue';
import { DenomInfo } from '@utils/DenomInfo';
import YesNoValues from '@models/YesNoValues';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { useTrackCreateVault } from '@hooks/useCreateVault/useTrackCreateVault';
import { BuildCreateVaultContext } from '../buildCreateVaultParams';
import { handleError } from '../handleError';

export const useCreateVaultWeightedScale = (initialDenom: DenomInfo | undefined) => {
  const { transactionType } = useStrategyInfo();
  const { address } = useWallet();
  const { fiatPrice } = useFiatPrice(initialDenom);
  const { calcSigningClient: client } = useCalcSigningClient();
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

    if (!fiatPrice) {
      throw Error('Invalid price');
    }

    if (Boolean(state.reinvestStrategy) && !reinvestStrategyData) {
      throw new Error('Invalid reinvest strategy.');
    }

    checkSwapAmountValue(state.swapAmount, fiatPrice);

    if (!state.initialDenom || !state.resultingDenom) {
      throw new Error('Invalid denoms');
    }

    const createVaultContext: BuildCreateVaultContext = {
      initialDenom: state.initialDenom,
      resultingDenom: state.resultingDenom,
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
