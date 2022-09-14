import {
  Button,
  Flex,
  Box,
  Spacer,
  Text,
  Stack,
  IconButton,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import Icon from '@components/Icon';
import { ChildrenProp } from '@components/Sidebar';
import { ArrowLeftIcon } from '@fusion-icons/react/interface';
import { useRouter } from 'next/router';

// object with each step and its corresponding href
const steps = [
  {
    href: '/create-strategy/dca-in',
  },
  {
    href: '/create-strategy/dca-in/step2',
  },
  {
    href: '/create-strategy/dca-in/confirm-purchase',
  },
  {
    href: '/create-strategy/dca-in/success',
    noBackButton: true,
    noJump: true,
  },
];

const useSteps = () => {
  const router = useRouter();
  const currentStepIndex = steps.findIndex((step) => step.href === router.pathname);
  const currentStep = steps[currentStepIndex];

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      router.push(steps[currentStepIndex + 1].href);
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
    if (stepIndex >= 0 && stepIndex < steps.length && !steps[stepIndex].noJump) {
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
};

// stepper with four circles representing the current step
function Stepper() {
  // use steps
  const { currentStep, currentStepIndex, goToStep } = useSteps();

  return (
    <Breadcrumb separator="">
      {steps.map((step, index) => {
        // handle click
        const handleClick = () => {
          // if the step is not the current step, go to it
          if (index !== currentStepIndex) {
            goToStep(index);
          }
        };

        return (
          <BreadcrumbItem key={step.href} isCurrentPage={currentStep.href === step.href}>
            <BreadcrumbLink onClick={handleClick}>
              <Flex cursor="pointer" w={6} h={6} borderRadius="full" bg="abyss" align="center" justify="center">
                <Flex w={4} h={4} borderRadius="full" bg="green.200" align="center" justify="center">
                  <Text textStyle="body-xs" color="navy">
                    {index + 1}
                  </Text>
                </Flex>
              </Flex>
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}

export default function NewStrategyModal({ children }: ChildrenProp) {
  return (
    <Box maxWidth={451} mx="auto" mt={24}>
      {children}
    </Box>
  );
}

export function NewStrategyModalBody({ children }: ChildrenProp) {
  return (
    <Box p={6} bg="darkGrey" borderRadius="2xl" boxShadow="md">
      {children}
    </Box>
  );
}

export function NewStrategyModalHeader({ resetForm, children }: { resetForm?: () => void } & ChildrenProp) {
  // router
  const router = useRouter();
  const { hasPreviousStep, previousStep } = useSteps();

  const handleCancel = async () => {
    if (resetForm) {
      resetForm();
    }
    router.push('/create-strategy');
  };
  return (
    <Flex bg="darkGrey" h={20} px={6} alignItems="center" borderRadius="2xl" mb={2} boxShadow="md">
      <Stack direction="row" spacing={3} alignItems="center">
        {hasPreviousStep && (
          <IconButton
            as="a"
            variant="ghost"
            colorScheme="blue"
            icon={<Icon as={ArrowLeftIcon} />}
            aria-label="back button"
            onClick={previousStep}
          />
        )}

        <Heading size="sm">{children}</Heading>
      </Stack>
      <Spacer />
      <Stepper />
      <Box position="relative">
        <Button
          position="absolute"
          bottom={4}
          right={-6}
          borderRadius={0}
          borderBottomLeftRadius="lg"
          borderTopRightRadius="2xl"
          size="xs"
          variant="ghost"
          bg="abyss"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
    </Flex>
  );
}

NewStrategyModalHeader.defaultProps = {
  resetForm: undefined,
};
