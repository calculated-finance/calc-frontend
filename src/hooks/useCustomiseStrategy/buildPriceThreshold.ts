import { getReceiveAmount } from '../useCreateVault/buildCreateVaultParams';
import { ConfigureVariables } from './ConfigureVariables';

export function buildPriceThreshold({ values, initialValues, context }: ConfigureVariables) {
  if (values.priceThresholdValue !== initialValues.priceThresholdValue) {
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
