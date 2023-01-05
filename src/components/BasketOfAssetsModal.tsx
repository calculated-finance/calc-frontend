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
  Box,
  Center,
  useDisclosure,
  OrderedList,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import { AgreementCheckbox } from '@components/AgreementCheckbox';
import { Form, Formik } from 'formik';
import Submit from '@components/Submit';

type AgreementForm = {
  acceptedAgreement: boolean;
};

export function BasketOfAssetsModal() {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Build a basket of assets</ModalHeader>
        <ModalBody>
          <Stack spacing={6}>
            <Text fontSize="sm">Congratulations on taking the first step to building long term wealth!</Text>
            <Box bg="abyss.200" p={4} fontSize="sm" borderRadius="xl" borderWidth={1} borderColor="slateGrey">
              <Stack spacing={2}>
                <Text>How this works:</Text>
                <OrderedList pl={3} spacing={2}>
                  <ListItem>
                    Choose your assets
                    <UnorderedList>
                      <ListItem>Select the assets you want to make up your basket</ListItem>
                    </UnorderedList>
                  </ListItem>

                  <ListItem>
                    Customise your basket
                    <UnorderedList>
                      <ListItem>Add a name, choose perm</ListItem>
                    </UnorderedList>
                  </ListItem>
                  <ListItem>
                    {' '}
                    Choose rebalancing method
                    <UnorderedList>
                      <ListItem>Select how the basket maintains it’s allocation</ListItem>
                    </UnorderedList>
                  </ListItem>
                  <ListItem>
                    Set permissions for management
                    <UnorderedList>
                      <ListItem>Choose how you manage your basket</ListItem>
                    </UnorderedList>
                  </ListItem>
                  <ListItem>
                    Confirm
                    <UnorderedList>
                      <ListItem>Review and confirm your choices</ListItem>
                    </UnorderedList>
                  </ListItem>
                </OrderedList>
              </Stack>
            </Box>
            <Button onClick={onClose}>Let&apos;s go!</Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
