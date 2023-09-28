import { FormControl, FormErrorMessage, Icon, Stack, useDisclosure } from '@chakra-ui/react';
import { SigningState } from '@components/NewStrategyModal';
import Submit from '@components/Submit';
import { TermsModal } from '@components/TermsModal';
import { CheckedIcon } from '@fusion-icons/react/interface';
import { useCreateVaultDca } from '@hooks/useCreateVault/useCreateVaultDca';
import { useDenom } from '@hooks/useDenom/useDenom';
import { Form, Formik, FormikHelpers } from 'formik';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import { useWallet } from '@hooks/useWallet';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import useStrategy from '@hooks/useStrategy';
import { useConfirmFormSimple } from '../useDcaInFormSimple';

export type AgreementForm = {
  acceptedAgreement: boolean;
};

export default function SimpleAgreementForm({ formikValues }: { formikValues: any }) {
  const { actions } = useConfirmFormSimple(); // normal usage here is to also pull 'state' from here, but it's not working
  const { connected } = useWallet();

  const state = formikValues as DcaInFormDataAll; // using state here instead (but sketchy and not really working) although it gives us a different error.

  const initialDenomInfo = useDenom(formikValues.initialDenom);

  const { mutate, isError, error, isLoading } = useCreateVaultDca(initialDenomInfo);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: reinvestStrategyData } = useStrategy(state?.reinvestStrategy);
  const validate = (values: AgreementForm) => {
    if (!values.acceptedAgreement) {
      return { acceptedAgreement: 'You must accept the terms and conditions before continuing.' };
    }

    return {};
  };

  console.log('state', state); // need this state to be accepted and work in mutate below

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) => {
    mutate(
      { state, reinvestStrategyData },
      {
        onSuccess: () => {
          actions.resetAction();
        },
        onSettled: () => {
          setSubmitting(false);
        },
      },
    );
  };

  return (
    <Formik initialValues={{ acceptedAgreement: false }} validate={validate} onSubmit={handleSubmit}>
      <Form>
        <SigningState isSigning={isLoading}>
          <Stack spacing={4}>
            {/*  FAB WANTED THIS REMOVED -> Now we should be able to just remove the whole second formik for agreement form */}
            {/* <AgreementCheckbox>
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
        </AgreementCheckbox> */}
            {connected ? (
              <FormControl isInvalid={isError}>
                <Submit w="full" type="submit" rightIcon={<Icon as={CheckedIcon} stroke="navy" />}>
                  Confirm
                </Submit>
                <FormErrorMessage>Failed to create strategy (Reason: {error?.message})</FormErrorMessage>
              </FormControl>
            ) : (
              <StepOneConnectWallet />
            )}
            <TermsModal showCheckbox={false} isOpen={isOpen} onClose={onClose} />
          </Stack>
        </SigningState>
      </Form>
    </Formik>
  );
}
