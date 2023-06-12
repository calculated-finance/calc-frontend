import { QuestionOutlineIcon } from '@chakra-ui/icons';
import * as Sentry from '@sentry/react';
import {
  Button,
  Flex,
  Box,
  Spacer,
  Image,
  Text,
  Stack,
  IconButton,
  Heading,
  Center,
  Divider,
  Icon as ChakraIcon,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react';
import Icon from '@components/Icon';
import Spinner from '@components/Spinner';
import { ArrowLeftIcon } from '@fusion-icons/react/interface';
import useSteps from '@hooks/useSteps';
import { useRouter } from 'next/router';
import { ChildrenProp } from '@helpers/ChildrenProp';
import broadcast from 'src/animations/broadcast.json';
import Lottie from 'lottie-react';
import { useWallet } from '@hooks/useWallet';
import { findStep } from '@helpers/findStep';
import { StepConfig } from '@formConfig/StepConfig';
import { Url, UrlObject } from 'url';
import Stepper from './Stepper';

export default function NewStrategyModal({ children }: ChildrenProp) {
  return (
    <Sentry.ErrorBoundary
      fallback={
        <Center m={8} p={8} flexDirection="column" gap={6}>
          <Heading size="lg">Something went wrong</Heading>
          <Image w={28} h={28} src="/images/notConnected.png" />
          <Text>Please try again in a new session</Text>
        </Center>
      }
    >
      <Box maxWidth={451} mx="auto" py={8} pb={200}>
        {children}
      </Box>
    </Sentry.ErrorBoundary>
  );
}

export function NewStrategyModalBody({
  children,
  isLoading,
  stepsConfig,
  isSigning,
}: ChildrenProp & { isLoading?: boolean; stepsConfig: StepConfig[]; isSigning?: boolean }) {
  const router = useRouter();
  const step = findStep(router.pathname, stepsConfig);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box p={6} bg="darkGrey" borderRadius="2xl" boxShadow="deepHorizon">
      <Box position="relative">
        {isLoading ? (
          <Center h={56}>
            <Spinner />
          </Center>
        ) : (
          <>
            {isSigning && (
              <Center position="absolute" w="full" h="full">
                <Stack spacing={6}>
                  <Lottie animationData={broadcast} loop />
                  <Heading size="xs">Review and approve the transaction.</Heading>
                </Stack>
              </Center>
            )}
            <Box visibility={isSigning ? 'hidden' : 'visible'}>
              {children}
              {Boolean(step?.footerText) && (
                <>
                  <Divider my={6} />
                  <Center>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      fontWeight="normal"
                      onClick={onOpen}
                      rightIcon={<ChakraIcon as={QuestionOutlineIcon} />}
                    >
                      {step?.footerText}
                    </Button>
                    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>{step?.footerText}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={12}>{step?.helpContent}</ModalBody>
                      </ModalContent>
                    </Modal>
                  </Center>
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export function NewStrategyModalHeader({
  resetForm,
  cancelUrl,
  stepsConfig,
  showStepper = true,
}: {
  cancelUrl: UrlObject | Url | string;
  resetForm?: () => void;
  stepsConfig: StepConfig[];
  showStepper?: boolean;
}) {
  const router = useRouter();
  const { currentStep, hasPreviousStep, previousStep, hasNextStep } = useSteps(stepsConfig);
  const { connected } = useWallet();

  const handleCancel = async () => {
    await router.push(cancelUrl);
    if (resetForm) {
      resetForm();
    }
  };
  return (
    <Flex
      bg="darkGrey"
      h={20}
      px={6}
      alignItems="center"
      borderRadius="2xl"
      mb={2}
      boxShadow="deepHorizon"
      data-testid="strategy-modal-header"
    >
      <Stack direction="row" spacing={3} alignItems="center">
        {hasPreviousStep && !hasNextStep && (
          <IconButton
            variant="ghost"
            colorScheme="blue"
            icon={<Icon as={ArrowLeftIcon} />}
            aria-label="back button"
            onClick={previousStep}
          />
        )}
        <Heading size="sm">{connected ? currentStep?.title : 'No wallet connected'}</Heading>
      </Stack>
      <Spacer />
      {showStepper && <Stepper steps={stepsConfig} />}
      {hasNextStep && (
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
