import { StepConfig } from '@formConfig/StepConfig';

export function findStep(path: string, stepsConfig: StepConfig[]) {
  return stepsConfig.find((step) => step.href === path);
}
