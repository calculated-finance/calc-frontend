import { StepConfig } from 'src/formConfig/StepConfig';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';

export default function useSteps(steps: StepConfig[]) {
  const router = useRouter();
  const currentStepIndex = steps.findIndex((step) => step.href === router.pathname);
  const currentStep = steps[currentStepIndex];

  const routerPush = (path: string, query?: ParsedUrlQueryInput) => {
    const newQuery = {...query, chain: router.query.chain}
    router.push({ pathname: path, query: newQuery});
  }

  const nextStep = (newQuery?: ParsedUrlQueryInput) => {
    if (currentStepIndex < steps.length - 1) {
      routerPush(steps[currentStepIndex + 1].href, newQuery);
    }
  };

  // has previous step
  const hasPreviousStep = currentStepIndex > 0 && !currentStep.noBackButton;

  // has next step
  const hasNextStep = currentStepIndex < steps.length - 1;

  const previousStep = () => {
    if (hasPreviousStep) {
      routerPush(steps[currentStepIndex - 1].href);
    }
  };

  // go to step
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      routerPush(steps[stepIndex].href);
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
