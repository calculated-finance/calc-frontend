import { DcaInFormDataAll } from '@models/DcaInFormData';
import { TransactionType } from '@components/TransactionType';
import getDenomInfo from '@utils/getDenomInfo';
import { Chains } from '@hooks/useChain/Chains';
import { buildCreateVaultMsg } from '.';

export function buildCreateVaultParamsDCA(
  state: DcaInFormDataAll,
  transactionType: TransactionType,
  senderAddress: string,
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
    swapAdjustment: undefined,
    performanceAssessmentStrategy: undefined,
  });

  return msg;
}
