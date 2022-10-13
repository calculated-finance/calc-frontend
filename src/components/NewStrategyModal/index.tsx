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
import steps, { StepConfig } from './steps';

// Actual Modal version

// export default function NewStrategyModal({ children }: ChildrenProp) {
//   return (
//     <Modal isOpen onClose={() => {}}>
//       <ModalContent bg="transparent" boxShadow="none" pt={24} zIndex={1}>
//         <Box maxWidth={451} zIndex={1}>
//           {children}
//         </Box>
//       </ModalContent>
//     </Modal>
//   );
// }

export default function NewStrategyModal({ children }: ChildrenProp) {
  return (
    <Box maxWidth={451} mx="auto" py={8}>
      {children}
    </Box>
  );
}

export function NewStrategyModalBody({ children, isLoading }: ChildrenProp & { isLoading?: boolean }) {
  const router = useRouter();
  return (
    <Box p={6} bg="darkGrey" borderRadius="2xl" boxShadow="deepHorizon">
      {isLoading ? (
        <Center h={56}>
          <Spinner />
        </Center>
      ) : (
        children
      )}
      {router.pathname !== steps[3].href && (
        <>
          <Divider my={6} />
          <Center>
            <Button variant="link" colorScheme="blue" rightIcon={<ChakraIcon as={QuestionOutlineIcon} />}>
              Can I set up reoccuring deposits?
            </Button>
          </Center>
        </>
      )}
    </Box>
  );
}

export function NewStrategyModalHeader({
  resetForm,
  children,
  finalStep = true,
  stepsConfig = steps,
}: { resetForm?: () => void; finalStep?: boolean; stepsConfig?: StepConfig[] } & ChildrenProp) {
  const router = useRouter();
  const { currentStep, hasPreviousStep, previousStep } = useSteps(stepsConfig);

  console.log('header', stepsConfig);

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
      <Stepper steps={stepsConfig} />
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
