import { CustomiseSchemaWeightedScale } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { buildWeightedScaleAdjustmentStrategy } from '@hooks/useCreateVault/buildCreateVaultParams';
import YesNoValues from '@models/YesNoValues';
import { ConfigureVariables } from './ConfigureVariables';

export function buildSwapAdjustmentStrategy({ values, initialValues, context, strategy }: ConfigureVariables) {
  if (!isWeightedScale(strategy)) {
    return {};
  }

  if (context.currentPrice === undefined) {
    throw new Error('Unable to get current price. Please try again.');
  }

  const castedValues = values as CustomiseSchemaWeightedScale;
  const castedInvitialValues = initialValues as CustomiseSchemaWeightedScale;
  const isWeightedScaleDirty =
    castedValues.applyMultiplier !== castedInvitialValues.applyMultiplier ||
    castedValues.basePriceIsCurrentPrice !== castedInvitialValues.basePriceIsCurrentPrice ||
    castedValues.basePriceValue !== castedInvitialValues.basePriceValue ||
    castedValues.swapMultiplier !== castedInvitialValues.swapMultiplier ||
    castedValues.applyMultiplier !== castedInvitialValues.applyMultiplier;

  if (isWeightedScaleDirty) {
    return {
      swap_adjustment_strategy: buildWeightedScaleAdjustmentStrategy(
        context.initialDenom,
        context.swapAmount,
        castedValues.basePriceValue || context.currentPrice,
        context.resultingDenom,
        context.transactionType,
        castedValues.applyMultiplier === YesNoValues.No,
        castedValues.swapMultiplier,
      ),
    };
  }
  return {};
}
