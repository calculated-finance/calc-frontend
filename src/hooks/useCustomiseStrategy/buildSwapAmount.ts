import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { CustomiseSchemaDca } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { ConfigureVariables } from './ConfigureVariables';

export function buildSwapAmount({ values, initialValues, strategy }: ConfigureVariables) {
  if (isDcaPlus(strategy) || isWeightedScale(strategy)) {
    return {};
  }
  const castedValues = values as CustomiseSchemaDca;
  const castedInitialValues = initialValues as CustomiseSchemaDca;
  const isSwapAmountDirty = castedValues.swapAmount !== castedInitialValues.swapAmount;

  if (isSwapAmountDirty) {
    return {
      swap_amount: `${castedValues.swapAmount}`,
    };
  }

  return {};
}
