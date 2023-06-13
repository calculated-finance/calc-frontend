import { getMinimumReceiveAmount } from '../useCreateVault/buildCreateVaultParams';
import { Chains } from '../useChain/Chains';
import { ConfigureVariables } from './ConfigureVariables';

export function buildPriceThreshold({ values, initialValues, context, strategy }: ConfigureVariables, chain: Chains) {
  const isPriceThresholdDirty = values.priceThresholdValue !== initialValues.priceThresholdValue;

  if (isPriceThresholdDirty) {
    return {
      minimum_receive_amount: getMinimumReceiveAmount(
        context.initialDenom,
        context.swapAmount,
        values.priceThresholdValue,
        context.resultingDenom,
        context.transactionType,
        chain,
      ),
    };
  }
  return {};
}
