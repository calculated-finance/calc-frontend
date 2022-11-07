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
} from '@chakra-ui/react';
import { AgreementCheckbox } from '@components/AgreementCheckbox';
import { Form, Formik } from 'formik';
import Submit from '@components/Submit';

export type TermsModalProps = {
  onSubmit?: () => void;
  showCheckbox: boolean;
} & Omit<ModalProps, 'children'>;

type AgreementForm = {
  acceptedAgreement: boolean;
};

export function TermsModal({ isOpen, onClose, onSubmit, showCheckbox }: TermsModalProps) {
  const validate = (values: AgreementForm) => {
    if (!values.acceptedAgreement && showCheckbox) {
      return { acceptedAgreement: 'You must accept the terms and conditions before continuing.' };
    }

    return {};
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>CALC Terms and Conditions</ModalHeader>
        <ModalBody>
          <Formik initialValues={{ acceptedAgreement: false }} validate={validate} onSubmit={handleSubmit}>
            <Form>
              <Stack spacing={6}>
                <Text fontSize="xs">
                  CALC is all about responsible tools built by everyone for anyone! Please read these terms carefully
                  and tick the box to acknowledge that you have read and accepted the terms and conditions.
                </Text>
                <Box
                  h={237}
                  overflowY="auto"
                  bg="abyss.200"
                  p={4}
                  fontSize="sm"
                  borderRadius="xl"
                  borderWidth={1}
                  borderColor="slateGrey"
                >
                  lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget aliquam tincidunt,
                  mauris nisl aliquam nisl, eget aliquam nisl nisl sit amet lorem. Donec auctor, nisl eget aliquam
                  tincidunt, mauris nisl aliquam nisl, eget aliquam nisl nisl sit amet lorem. Donec auctor, nisl eget
                  aliquam tincidunt, mauris nisl aliquam nisl, <br />
                  eget aliquam nisl nisl sit amet lorem. Donec auctor, nisl eget aliquam tincidunt, mauris nisl aliquam
                  nisl, eget aliquam nisl nisl sit amet lorem. Donec auctor, nisl eget aliquam tincidunt, mauris nisl
                  <br />
                  aliquam nisl, eget aliquam nisl nisl sit amet lorem. Donec auctor, nisl eget aliquam tincidunt, mauris
                  nisl aliquam nisl, eget aliquam nisl nisl sit amet lorem. Donec auctor, nisl eget aliquam tincidunt,
                  mauris nisl aliquam nisl, eget aliquam nisl nisl sit amet lorem. Donec auctor, nisl eget aliquam
                  tincidunt, mauris nisl aliquam nisl, eget aliquam nisl nisl sit amet lorem. Donec auctor, nisl eget
                  <br />
                  aliquam tincidunt, mauris nisl aliquam nisl, eget aliquam nisl nisl sit amet lorem. Donec auctor, nisl
                  eget aliquam tincidunt, mauris nisl aliquam nisl, eget aliquam nisl
                </Box>
                {showCheckbox ? (
                  <>
                    <Center>
                      <AgreementCheckbox>
                        <Text fontSize="xs">I have read and agree to be bound by the CALC Terms &amp; Conditions.</Text>
                      </AgreementCheckbox>
                    </Center>
                    <Stack spacing={3}>
                      <Submit>Let&apos;s go!</Submit>
                      <Button onClick={onClose} variant="ghost" colorScheme="brand">
                        I&apos;ll read this later
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <Submit>Close</Submit>
                )}
              </Stack>
            </Form>
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
