import { step1ValidationSchema } from '@models/DcaInFormData';
import { StrategyType } from '@models/StrategyType';
import { DcaPlusAssetsFormSchema } from '@models/dcaPlusFormData';
import { WeightedScaleAssetsFormSchema } from '@models/weightedScaleFormData';

export function getValidationSchema(strategySelected: StrategyType) {
  if (strategySelected === (StrategyType.DCAIn || StrategyType.DCAOut)) {
    return step1ValidationSchema;
  }
  if (strategySelected === (StrategyType.DCAPlusIn || StrategyType.DCAPlusOut)) {
    return DcaPlusAssetsFormSchema;
  }
  return WeightedScaleAssetsFormSchema;
}
