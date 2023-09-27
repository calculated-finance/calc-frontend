import { Button, FormControl, FormErrorMessage, useDisclosure, Text, Stack } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { CheckedIcon } from '@fusion-icons/react/interface';
import { Form, Formik, FormikHelpers } from 'formik';
import Submit from '@components/Submit';
import { TermsModal } from '@components/TermsModal';
import { AgreementCheckbox } from '../AgreementCheckbox';

export type AgreementForm = {
  acceptedAgreement: boolean;
};

export function SummaryAgreementForm({
  isError,
  error,
  onSubmit,
}: {
  isError: boolean;
  error: Error | null;
  onSubmit: (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const validate = (values: AgreementForm) => {
    if (!values.acceptedAgreement) {
      return { acceptedAgreement: 'You must accept the terms and conditions before continuing.' };
    }
    return {};
  };

  return (
    <Formik initialValues={{ acceptedAgreement: false }} validate={validate} onSubmit={onSubmit}>
      <Form>
        <Stack spacing={4}>
          <AgreementCheckbox>
            <Text textStyle="body-xs">
              I have read and agree to be bound by the{' '}
              <Button
                textDecoration="underline"
                fontWeight="normal"
                size="xs"
                display="inline-flex"
                colorScheme="blue"
                variant="unstyled"
                onClick={onOpen}
              >
                CALC Terms & Conditions.
              </Button>
            </Text>
          </AgreementCheckbox>
          <FormControl isInvalid={isError}>
            <Submit w="full" type="submit" rightIcon={<Icon as={CheckedIcon} stroke="navy" />}>
              Confirm
            </Submit>
            <FormErrorMessage>Failed to create strategy (Reason: {error?.message})</FormErrorMessage>
          </FormControl>
          <TermsModal showCheckbox={false} isOpen={isOpen} onClose={onClose} />
        </Stack>
      </Form>
    </Formik>
  );
}
