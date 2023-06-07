import * as Yup from 'yup';
import { allSchema } from '@models/DcaInFormData';

export const customiseSchemaDca = Yup.object({
  advancedSettings: allSchema.advancedSettings,
  executionInterval: allSchema.executionInterval,
  executionIntervalIncrement: allSchema.executionIntervalIncrement,
  slippageTolerance: allSchema.slippageTolerance,
  priceThresholdEnabled: allSchema.priceThresholdEnabled,
  priceThresholdValue: allSchema.priceThresholdValue,
});

export type CustomiseSchemaDca = Yup.InferType<typeof customiseSchemaDca>;
