import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Box,
  Spacer,
  Stack,
  IconButton,
  Heading,
  Center,
  Spinner,
  Divider,
  Icon as ChakraIcon,
} from '@chakra-ui/react';
import Icon from '@components/Icon';
import { ChildrenProp } from '@components/Sidebar';
import { ArrowLeftIcon } from '@fusion-icons/react/interface';
import useSteps from '@hooks/useSteps';
import { useRouter } from 'next/router';
import Stepper from './Stepper';
import { findStep, StepConfig } from './steps';

export default function NewStrategyModal({ children }: ChildrenProp) {
  return (
    <Box maxWidth={451} mx="auto" py={8}>
      {children}
    </Box>
  );
}

export function NewStrategyModalBody({
  children,
  isLoading,
  stepsConfig,
}: ChildrenProp & { isLoading?: boolean; stepsConfig: StepConfig[] }) {
  const router = useRouter();
  const step = findStep(router.pathname, stepsConfig);
  return (
    <Box p={6} bg="darkGrey" borderRadius="2xl" boxShadow="deepHorizon">
      {isLoading ? (
        <Center h={56}>
          <Spinner />
        </Center>
      ) : (
        <>
          {children}
          {Boolean(step?.footerText) && (
            <>
              <Divider my={6} />
              <Center>
                <Button
                  variant="link"
                  colorScheme="blue"
                  fontWeight="normal"
                  rightIcon={<ChakraIcon as={QuestionOutlineIcon} />}
                >
                  {step?.footerText}
                </Button>
              </Center>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export function NewStrategyModalHeader({
  resetForm,
  finalStep = true,
  stepsConfig,
  showStepper = true,
}: { resetForm?: () => void; finalStep?: boolean; stepsConfig: StepConfig[]; showStepper?: boolean } & ChildrenProp) {
  const router = useRouter();
  const { currentStep, hasPreviousStep, previousStep } = useSteps(stepsConfig);

  const handleCancel = async () => {
    await router.push('/create-strategy');
    if (resetForm) {
      resetForm();
    }
  };
  return (
    <Flex bg="darkGrey" h={20} px={6} alignItems="center" borderRadius="2xl" mb={2} boxShadow="deepHorizon">
      <Stack direction="row" spacing={3} alignItems="center">
        {hasPreviousStep && finalStep && (
          <IconButton
            variant="ghost"
            colorScheme="blue"
            icon={<Icon as={ArrowLeftIcon} />}
            aria-label="back button"
            onClick={previousStep}
          />
        )}

        <Heading size="sm">{currentStep?.title}</Heading>
      </Stack>
      <Spacer />
      {showStepper && <Stepper steps={stepsConfig} />}
      {finalStep && (
        <Box position="relative">
          <Button
            position="absolute"
            bottom={5}
            right={-6}
            borderRadius={0}
            borderBottomLeftRadius="lg"
            borderTopRightRadius="2xl"
            size="xs"
            variant="ghost"
            bg="abyss.200"
            fontSize="xx-small"
            onClick={handleCancel}
            height={5}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Flex>
  );
}

NewStrategyModalHeader.defaultProps = {
  resetForm: undefined,
};
