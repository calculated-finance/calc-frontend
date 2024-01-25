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
} from '@chakra-ui/react';
import { AgreementCheckbox } from '@components/AgreementCheckbox';
import { Form, Formik } from 'formik';
import Submit from '@components/Submit';
import { useCookieState } from 'ahooks';
import { useEffect } from 'react';
import { useWallet } from '@hooks/useWallet';

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
                  <Stack spacing={2}>
                    <Text as="i">Last Updated: September 15th, 2022</Text>
                    <Text>
                      Please read these terms carefully and click the button at the bottom to acknowledge that you have
                      read and accepted the terms and conditions.
                    </Text>
                    <Text>
                      CALC is a decentralized peer-to-peer app built on the Kujira and Osmosis blockchains that people
                      can use to participate in decentralized financial products.
                    </Text>
                    <Text>
                      AS DESCRIBED IN THE CALC LICENSES, THE CALC PROTOCOL IS PROVIDED &ldquo;AS IS&rdquo;, AT YOUR OWN
                      RISK, AND WITHOUT WARRANTIES OF ANY KIND.
                    </Text>
                    <Text>
                      Although Future Chain Labs developed much of the initial code for the CALC protocol, it does not
                      provide, own, or control the CALC protocol, which is run by a decentralized validator set.
                      Upgrades and modifications to the protocol are managed in a community-driven way by holders of the
                      KUJI governance token. No developer or entity involved in creating the CALC protocol will be
                      liable for any claims or damages whatsoever associated with your use, inability to use, or your
                      interaction with other users of the CALC protocol, including any direct, indirect, incidental,
                      special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies,
                      tokens, or anything else of value.
                    </Text>
                  </Stack>
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
