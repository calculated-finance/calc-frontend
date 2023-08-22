import * as Yup from 'yup';
import { allSchema } from '@models/DcaInFormData';
import { weightedScaleSchemaFields } from '@models/weightedScaleFormData';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { Strategy } from '@models/Strategy';

export const customiseSchemaDca = Yup.object({
  advancedSettings: allSchema.advancedSettings,
  executionInterval: allSchema.executionInterval,
  executionIntervalIncrement: allSchema.executionIntervalIncrement,
  slippageTolerance: allSchema.slippageTolerance,
  priceThresholdEnabled: allSchema.priceThresholdEnabled,
  priceThresholdValue: allSchema.priceThresholdValue,
  swapAmount: Yup.number()
    .label('Swap Amount')
    .required()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '') {
        return null;
      }
      return value;
    }),
  initialDenom: allSchema.initialDenom,
  resultingDenom: allSchema.resultingDenom
});

export type CustomiseSchemaDca = Yup.InferType<typeof customiseSchemaDca>;

export const customiseSchemaDcaPlus = Yup.object({
  advancedSettings: allSchema.advancedSettings,
  slippageTolerance: allSchema.slippageTolerance,
  priceThresholdEnabled: allSchema.priceThresholdEnabled,
  priceThresholdValue: allSchema.priceThresholdValue,
});

export type CustomiseSchemaDcaPlus = Yup.InferType<typeof customiseSchemaDcaPlus>;

export const customiseSchemaWeightedScale = Yup.object({
  advancedSettings: allSchema.advancedSettings,
  executionInterval: allSchema.executionInterval,
  executionIntervalIncrement: allSchema.executionIntervalIncrement,
  slippageTolerance: allSchema.slippageTolerance,
  priceThresholdEnabled: allSchema.priceThresholdEnabled,
  priceThresholdValue: allSchema.priceThresholdValue,
  basePriceIsCurrentPrice: weightedScaleSchemaFields.basePriceIsCurrentPrice,
  basePriceValue: weightedScaleSchemaFields.basePriceValue,
  swapMultiplier: weightedScaleSchemaFields.swapMultiplier,
  applyMultiplier: weightedScaleSchemaFields.applyMultiplier,
});

export type CustomiseSchemaWeightedScale = Yup.InferType<typeof customiseSchemaWeightedScale>;

export type CustomiseSchema = CustomiseSchemaDca | CustomiseSchemaDcaPlus | CustomiseSchemaWeightedScale;

export function getCustomiseSchema(strategy: Strategy) {
  if (isDcaPlus(strategy)) {
    return customiseSchemaDcaPlus;
  }
  if (isWeightedScale(strategy)) {
    return customiseSchemaWeightedScale;
  }
  return customiseSchemaDca;
}
