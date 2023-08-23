import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { CustomiseSchemaDca } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
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

  // console.log(castedInvitialValues.swapAmount, castedValues.swapAmount, context.swapAmount);

  const isSwapAmountDirty = castedValues.swapAmount !== castedInvitialValues.swapAmount;

  if (isSwapAmountDirty) {
    return {
      swap_amount: castedValues.swapAmount && castedValues.swapAmount,
    };
  }
  return {};
}
