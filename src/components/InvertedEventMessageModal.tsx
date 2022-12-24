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

export function InvertedEventMessageModal() {
  const { isOpen: isRefundModalOpen, onClose: onRefundModalClose } = useDisclosure({ defaultIsOpen: true });

  //  create date one year from now
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  const [refundMessageSeen, setRefundMessageSeen] = useCookieState('invertedEventMessageSeen', {
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
                Please note that as of December 24 your swap amount and the amount you receive may not initially match -
                this is due to a FIN contract update for how swap events were logged.
              </Text>
              <Text textStyle="body">
                All funds are safe, the team is already working on the fix and all funds will be appropriately
                distributed to your wallet on December 27th.
              </Text>
              <Text textStyle="body">No action from you required.</Text>
              <Text textStyle="body">Thank you for your patience. 🙌</Text>
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
