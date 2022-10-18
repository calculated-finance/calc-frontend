import {
  Button,
  Heading,
  Text,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useToast,
  ModalProps,
  Stack,
} from '@chakra-ui/react';
import { Strategy } from '@hooks/useStrategies';
import getDenomInfo from '@utils/getDenomInfo';
import React from 'react';
import useCancelStrategy from 'src/hooks/useCancelStrategy';

type CancelStrategyModalProps = {
  strategy: Strategy;
  onCancel?: () => void;
} & Omit<ModalProps, 'children'>;

export default function CancelStrategyModal({ isOpen, onClose, onCancel, strategy }: CancelStrategyModalProps) {
  const { cancelStrategy, isLoading } = useCancelStrategy();

  const toast = useToast();

  const handleCancelStrategy = () =>
    cancelStrategy(strategy.id, {
      onSuccess: () => {
        toast({
          title: 'Strategy cancelled.',
          position: 'top-right',
          description: "We've cancelled your strategy and refunded remaining funds.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        if (onCancel) {
          onCancel();
        }
      },
      onError: (error: any) => {
        toast({
          title: 'Something went wrong',
          position: 'top-right',
          description: `There was a problem cancelling your strategy (Reason: ${error.message})`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      },
      onSettled: onClose,
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="darkGrey" p={4}>
        <ModalHeader textAlign="center">Cancel Strategy?</ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <Text textStyle="body-xs" textAlign="center">
              By cancelling this strategy any assets held in the CALC vault will be returned. Once cancelled, this
              strategy can not be started again. Please create a new strategy.
            </Text>
            <Text textStyle="body-xs" textAlign="center">
              For strategies involving fiat on ramps, any direct debits or recurring payments will also be cancelled.
            </Text>
            <Flex layerStyle="panel" p={4} mt={4} align="center">
              <Heading size="sm">Amount to be returned:</Heading>
              <Spacer />
              <Text as="span" fontSize="lg" color="blue.200">
                {/* TODO: what happens for multiple denoms? */}
                {getDenomInfo(strategy.balance.denom).conversion(Number(strategy.balance.amount))}{' '}
                {getDenomInfo(strategy.balance.denom).name}
              </Text>
            </Flex>
            <Text textAlign="center" textStyle="body-xs">
              Cancellation Fee: TBD
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Flex justify="center" w="full">
            <Stack direction="column" spacing={3}>
              <Button onClick={handleCancelStrategy} isLoading={isLoading}>
                Cancel Strategy
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Back
              </Button>
            </Stack>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
