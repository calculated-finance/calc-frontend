import { getReceiveAmount } from '../useCreateVault/buildCreateVaultParams';
import { ConfigureVariables } from './ConfigureVariables';

export function buildSwapAmount({ values, initialValues, context }: ConfigureVariables) {
  const isSwapAmountDirty = values.swapAmount !== initialValues.swapAmount;

  if (isSwapAmountDirty) {
    return {
      minimum_receive_amount: values.priceThresholdValue
        ? getReceiveAmount(
            context.initialDenom,
            context.swapAmount,
            values.priceThresholdValue,
            context.resultingDenom,
            context.transactionType,
          )
        : undefined,
    };
  }
  return {};
}
