import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { CustomiseSchemaDca } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { getReceiveAmount } from '../useCreateVault/buildCreateVaultParams';
import { ConfigureVariables } from './ConfigureVariables';

export function buildSwapAmount({ values, initialValues, context, strategy }: ConfigureVariables) {
  if (isDcaPlus(strategy) || isWeightedScale(strategy)) {
    return {};
  }

  if (context.currentPrice === undefined) {
    throw new Error('Unable to get current price. Please try again.');
  }

  const castedValues = values as CustomiseSchemaDca;
  const castedInvitialValues = initialValues as CustomiseSchemaDca;
  const isSwapAmountDirty = castedValues.swapAmount !== castedInvitialValues.swapAmount;

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
