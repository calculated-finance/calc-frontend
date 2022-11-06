import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Text, ModalProps } from '@chakra-ui/react';
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>CALC Terms and Conditions</ModalHeader>
        <ModalBody>
          <Formik initialValues={{ acceptedAgreement: false }} validate={validate} onSubmit={handleSubmit}>
            <Form>
              <Text>
                CALC is all about responsible tools built by everyone for anyone! Please read these terms carefully and
                tick the box to acknowledge that you have read and accepted the terms and conditions.
              </Text>
              {showCheckbox ? (
                <>
                  <AgreementCheckbox />
                  <Submit>Let&apos;s go!</Submit>
                </>
              ) : (
                <Submit>Close</Submit>
              )}
            </Form>
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
