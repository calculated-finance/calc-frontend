import { StepConfig } from 'src/formConfig/StepConfig';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import { routerPush } from '../helpers/routerPush';

export default function useSteps(steps: StepConfig[]) {
  const router = useRouter();
  const currentStepIndex = steps.findIndex((step) => step.href === router.pathname);
  const currentStep = steps[currentStepIndex];

  const nextStep = (newQuery?: ParsedUrlQueryInput) => {
    if (currentStepIndex < steps.length - 1) {
      routerPush(router, steps[currentStepIndex + 1].href, newQuery);
    }
  };

  // has previous step
  const hasPreviousStep = currentStepIndex > 0 && !currentStep.noBackButton;

  // has next step
  const hasNextStep = currentStepIndex < steps.length - 1;

  const previousStep = () => {
    if (hasPreviousStep) {
      routerPush(router, steps[currentStepIndex - 1].href);
    }
  };

  // go to step
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      routerPush(router, steps[stepIndex].href);
    }
  };

  return {
    currentStep,
    currentStepIndex,
    nextStep,
    hasPreviousStep,
    hasNextStep,
    previousStep,
    goToStep,
  };
}
export function useStepsRefactored(steps: StepConfig[], strategyType: string | undefined) {
  const router = useRouter();
  const currentStepIndex = steps.findIndex((step) => step.strategyType === strategyType);
  const currentStep = steps[currentStepIndex];

  const nextStep = (newQuery?: ParsedUrlQueryInput) => {
    if (currentStepIndex < steps.length - 1) {
      routerPush(router, steps[currentStepIndex + 1].href, newQuery);
    }
  };

  // has previous step
  const hasPreviousStep = currentStepIndex > 0 && !currentStep.noBackButton;

  // has next step
  const hasNextStep = currentStepIndex < steps.length - 1;

  const previousStep = () => {
    if (hasPreviousStep) {
      routerPush(router, steps[currentStepIndex - 1].href);
    }
  };

  // go to step
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      routerPush(router, steps[stepIndex].href);
    }
  };

  return {
    currentStep,
    currentStepIndex,
    nextStep,
    hasPreviousStep,
    hasNextStep,
    previousStep,
    goToStep,
  };
}
