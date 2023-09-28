import { StepConfig } from '@formConfig/StepConfig';
import dcaInSteps from '@formConfig/dcaIn';
import dcaOutSteps from '@formConfig/dcaOut';
import { dcaPlusInSteps } from '@formConfig/dcaPlusIn';
import dcaPlusOutSteps from '@formConfig/dcaPlusOut';
import simpleDcaInSteps from '@formConfig/simpleDcaIn';
import { weightedScaleInSteps } from '@formConfig/weightedScaleIn';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import { StrategyTypes } from '@models/StrategyTypes';

export const stepsByStrategyType: Record<StrategyTypes, StepConfig[]> = {
  [StrategyTypes.SimpleDCAIn]: simpleDcaInSteps,
  [StrategyTypes.DCAIn]: dcaInSteps,
  [StrategyTypes.DCAOut]: dcaOutSteps,
  [StrategyTypes.DCAPlusIn]: dcaPlusInSteps,
  [StrategyTypes.DCAPlusOut]: dcaPlusOutSteps,
  [StrategyTypes.WeightedScaleIn]: weightedScaleInSteps,
  [StrategyTypes.WeightedScaleOut]: weightedScaleOutSteps,
};

export function getSteps(strategySelected: StrategyTypes) {
  return stepsByStrategyType[strategySelected];
}
