import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { getSwapAmount } from '@hooks/useCreateVault/buildCreateVaultParams';
import { CustomiseSchemaDca } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { ConfigureVariables } from './ConfigureVariables';

export function buildSwapAmount({ values, initialValues, context, strategy }: ConfigureVariables) {
  if (isDcaPlus(strategy) || isWeightedScale(strategy)) {
    return {};
  }

  const castedValues = values as CustomiseSchemaDca;
  const castedInvitialValues = initialValues as CustomiseSchemaDca;

  const isSwapAmountDirty = castedValues.swapAmount !== castedInvitialValues.swapAmount;

  console.log(isSwapAmountDirty);
  console.log(getSwapAmount(context.initialDenom, castedValues.swapAmount));
  console.log(context.initialDenom);

  if (isSwapAmountDirty) {
    return {
      swap_amount: getSwapAmount(context.initialDenom, castedValues.swapAmount),
    };
  }
  return {};
}
