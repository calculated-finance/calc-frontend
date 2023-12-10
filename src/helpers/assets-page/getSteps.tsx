import { StepConfig } from '@formConfig/StepConfig';
import dcaInSteps from '@formConfig/dcaIn';
import dcaOutSteps from '@formConfig/dcaOut';
import { dcaPlusInSteps } from '@formConfig/dcaPlusIn';
import dcaPlusOutSteps from '@formConfig/dcaPlusOut';
import simpleDcaInSteps from '@formConfig/simpleDcaIn';
import streamingSwapSteps from '@formConfig/streamingSwap';
import { weightedScaleInSteps } from '@formConfig/weightedScaleIn';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import { StrategyType } from '@models/StrategyType';

export const stepsByStrategyType: Record<StrategyType, StepConfig[]> = {
  [StrategyType.SimpleDCAIn]: simpleDcaInSteps,
  [StrategyType.DCAIn]: dcaInSteps,
  [StrategyType.DCAOut]: dcaOutSteps,
  [StrategyType.DCAPlusIn]: dcaPlusInSteps,
  [StrategyType.DCAPlusOut]: dcaPlusOutSteps,
  [StrategyType.WeightedScaleIn]: weightedScaleInSteps,
  [StrategyType.WeightedScaleOut]: weightedScaleOutSteps,
  [StrategyType.StreamingSwap]: streamingSwapSteps,
};

export function getSteps(strategySelected: StrategyType) {
  return stepsByStrategyType[strategySelected];
}
