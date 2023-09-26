import { Button, FormControl, FormErrorMessage, Icon, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { SigningState } from '@components/NewStrategyModal';
import simpleDcaInSteps from '@formConfig/simpleDcaIn';
import { getTimeSaved } from '@helpers/getTimeSaved';
import useDcaInFormSimplified from '@hooks/useDcaInSimplifiedForm';
import { useDenom } from '@hooks/useDenom/useDenom';
import useSteps from '@hooks/useSteps';
import { Form, Formik, FormikHelpers, useField } from 'formik';
import { AgreementCheckbox } from '@components/AgreementCheckbox';
import { useCreateVaultDca } from '@hooks/useCreateVault/useCreateVaultDca';
import Submit from '@components/Submit';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import useStrategy from '@hooks/useStrategy';
import { CheckedIcon } from '@fusion-icons/react/interface';
import { TermsModal } from '@components/TermsModal';
import { useWallet } from '@hooks/useWallet';
import { AgreementForm } from './SimpleAgreementForm';

export function ConfirmSimpleDca() {
  const { state, actions } = useDcaInFormSimplified();

  const [{ value: swapAmount }] = useField({ name: 'swapAmount' });
  const [{ value: initialDeposit }] = useField({ name: 'initialDeposit' });
  const [{ value: initialDenom }] = useField({ name: 'initialDenom' });

  const initialDenomInfo = useDenom(initialDenom);

  const { nextStep } = useSteps(simpleDcaInSteps);
  const { mutate, isError, error, isLoading } = useCreateVaultDca(initialDenomInfo);
  const { connected } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: reinvestStrategyData } = useStrategy(state?.reinvestStrategy);

  const validate = (values: AgreementForm) => {
    if (!values.acceptedAgreement) {
      return { acceptedAgreement: 'You must accept the terms and conditions before continuing.' };
    }

    return {};
  };

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(
      { state, reinvestStrategyData },
      {
        onSuccess: async (strategyId) => {
          await nextStep({
            strategyId,
            timeSaved: state && getTimeSaved(initialDeposit, swapAmount),
          });
          actions.resetAction();
        },
        onSettled: () => {
          setSubmitting(false);
        },
      },
    );

  return (
    <Formik initialValues={{ acceptedAgreement: false }} validate={validate} onSubmit={handleSubmit}>
      <Form>
        <SigningState isSigning={isLoading}>
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
              {connected ? (
                <Submit w="full" type="submit" rightIcon={<Icon as={CheckedIcon} stroke="navy" />}>
                  Confirm
                </Submit>
              ) : (
                <StepOneConnectWallet />
              )}
              <FormErrorMessage>Failed to create strategy (Reason: {error?.message})</FormErrorMessage>
            </FormControl>
            <TermsModal showCheckbox={false} isOpen={isOpen} onClose={onClose} />
          </Stack>
        </SigningState>
      </Form>
    </Formik>
  );
}
