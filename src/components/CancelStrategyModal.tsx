import {
  Button,
  Heading,
  Text,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Center,
  Spacer,
  useToast,
  ModalProps,
} from '@chakra-ui/react';
import { Strategy } from '@hooks/useStrategies';
import React from 'react';
import useCancelStrategy from 'src/hooks/useCancelStrategy';

type CancelStrategyModalProps = {
  strategy: Strategy;
} & Omit<ModalProps, 'children'>;

export default function CancelStrategyModal({ isOpen, onClose, strategy }: CancelStrategyModalProps) {
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
        onClose();
      },
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cancel Strategy</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center textStyle="body-xs">
            By cancelling this strategy any assets held in the CALC vault will be returned. Once cancelled, this
            strategy can not be started again. Please create a new strategy.
          </Center>
          <Center textStyle="body-xs">
            For strategies involving fiat on ramps, any direct debits or recurring payments will also be cancelled.
          </Center>
          <Flex layerStyle="panel" p={4} mt={4}>
            <Heading size="sm">Amount to be returned:</Heading>
            <Spacer />
            <Text as="span" color="blue.200">
              {/* TODO: what happens for multiple denoms? */}
              {strategy.balances[0].current.amount} {strategy.balances[0].current.denom}
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleCancelStrategy} isLoading={isLoading}>
            Cancel Strategy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
