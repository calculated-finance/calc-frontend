import React from 'react';
import { Modal, ModalOverlay, Text, HStack, ModalContent, Flex, ModalBody, Heading, Button } from '@chakra-ui/react';
import { useWallet } from '@wizard-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function ConnectWalletModal({ isOpen, onClose }: Props) {
  const { connect } = useWallet();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Flex direction="column" justify="center" align="center" textAlign="center">
            <Heading size="sm" mb="8" textTransform="uppercase" color="whiteAlpha.600">
              Connect wallet
            </Heading>
            <Button
              w="full"
              mb="4"
              _hover={{
                bg: 'whiteAlpha.100',
              }}
              onClick={() => connect()}
            >
              <HStack spacing="6">
                <Text>Keplr</Text>
              </HStack>
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ConnectWalletModal;
