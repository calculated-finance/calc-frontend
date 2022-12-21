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
  useDisclosure,
} from '@chakra-ui/react';
import { useCookieState } from 'ahooks';

export type TermsModalProps = Omit<ModalProps, 'children'>;

export function RefundMessageModal() {
  const { isOpen: isRefundModalOpen, onClose: onRefundModalClose } = useDisclosure({ defaultIsOpen: true });

  //  create date one year from now
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  const [refundMessageSeen, setRefundMessageSeen] = useCookieState('refundMessageSeen', {
    expires: oneYearFromNow,
  });

  const isRefundMessageSeen = refundMessageSeen === 'true';

  const handleAcknowledgement = () => {
    setRefundMessageSeen('true');
    onRefundModalClose();
  };

  return (
    <Modal isOpen={isRefundModalOpen && !isRefundMessageSeen} onClose={onRefundModalClose} autoFocus={false}>
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

            <Button onClick={handleAcknowledgement} colorScheme="brand">
              Ok
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
