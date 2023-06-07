import * as Yup from 'yup';
import { allSchema } from '@models/DcaInFormData';
import { weightedScaleSchemaFields } from '@models/weightedScaleFormData';

export const customiseSchemaDca = Yup.object({
  advancedSettings: allSchema.advancedSettings,
  executionInterval: allSchema.executionInterval,
  executionIntervalIncrement: allSchema.executionIntervalIncrement,
  slippageTolerance: allSchema.slippageTolerance,
  priceThresholdEnabled: allSchema.priceThresholdEnabled,
  priceThresholdValue: allSchema.priceThresholdValue,
  strategyDuration: allSchema.strategyDuration,
  basePriceIsCurrentPrice: weightedScaleSchemaFields.basePriceIsCurrentPrice,
  basePriceValue: weightedScaleSchemaFields.basePriceValue,
  swapMultiplier: weightedScaleSchemaFields.swapMultiplier,
  applyMultiplier: weightedScaleSchemaFields.applyMultiplier,
});

export type CustomiseSchemaDca = Yup.InferType<typeof customiseSchemaDca>;
