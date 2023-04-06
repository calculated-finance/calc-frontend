import { StepConfig } from 'src/formConfig/StepConfig';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';

export default function useSteps(steps: StepConfig[]) {
  const router = useRouter();
  const currentStepIndex = steps.findIndex((step) => step.href === router.pathname);
  const currentStep = steps[currentStepIndex];

  const nextStep = (query?: UrlObject['query']) => {
    if (currentStepIndex < steps.length - 1) {
      router.push({ pathname: steps[currentStepIndex + 1].href, query });
    }
  };

  // has previous step
  const hasPreviousStep = currentStepIndex > 0 && !currentStep.noBackButton;

  const previousStep = () => {
    if (hasPreviousStep) {
      router.push(steps[currentStepIndex - 1].href);
    }
  };

  // go to step
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      router.push(steps[stepIndex].href);
    }
  };

  return {
    currentStep,
    currentStepIndex,
    nextStep,
    hasPreviousStep,
    previousStep,
    goToStep,
  };
}
