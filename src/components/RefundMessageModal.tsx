import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  ModalProps,
  Stack,
  Button,
} from '@chakra-ui/react';

export type TermsModalProps = Omit<ModalProps, 'children'>;

export function RefundMessageModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Important information</ModalHeader>
        <ModalBody>
          <Stack spacing={6}>
            <Stack>
              <Text textStyle="body">
                Please note that as of December 19 you may not be receiving your full swap amount - this is due to a FIN
                contract update that occurred on December 19.
              </Text>
              <Text textStyle="body">
                All funds are safe, the team is already working on the fix and all funds will be appropriately
                distributed to your wallet.
              </Text>
              <Text textStyle="body">No action from you required.</Text>
            </Stack>

            <Button onClick={onClose} colorScheme="brand">
              Ok
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
