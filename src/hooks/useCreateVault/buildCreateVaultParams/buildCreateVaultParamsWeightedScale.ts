import { TransactionType } from '@components/TransactionType';
import getDenomInfo from '@utils/getDenomInfo';
import { Chains } from '@hooks/useChain/Chains';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { buildCallbackDestinations } from '@helpers/destinations';
import { buildCreateVaultMsg } from '.';

export function buildCreateVaultParamsWeightedScale(
  state: WeightedScaleState,
  transactionType: TransactionType,
  senderAddress: string,
  currentPrice: number,
  chain: Chains,
) {
  const {
    executionInterval,
    executionIntervalIncrement,
    startDate,
    purchaseTime,
    swapAmount,
    startPrice,
    advancedSettings,
    slippageTolerance,
    autoStakeValidator,
    recipientAccount,
    yieldOption,
    reinvestStrategy,
    priceThresholdValue,
  } = state;

  const initialDenom = getDenomInfo(state.initialDenom);
  const resultingDenom = getDenomInfo(state.resultingDenom);

  const destinations = buildCallbackDestinations(
    chain,
    autoStakeValidator,
    recipientAccount,
    yieldOption,
    senderAddress,
    reinvestStrategy,
  );

  const msg = buildCreateVaultMsg({
    initialDenom,
    resultingDenom,
    timeInterval: { interval: executionInterval, increment: executionIntervalIncrement },
    timeTrigger: { startDate, startTime: purchaseTime },
    startPrice: startPrice || undefined,
    swapAmount,
    priceThreshold: priceThresholdValue || undefined,
    transactionType,
    slippageTolerance,
    destinations,
    swapAdjustment: {
      basePrice: state.basePriceValue || currentPrice,
      swapMultiplier: state.swapMultiplier,
      applyMultiplier: state.applyMultiplier,
    },
    isDcaPlus: false,
  });

  return msg;
}
