import { Button, Center, FormControl, FormErrorMessage, Stack, useDisclosure, Text } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { CheckedIcon } from '@fusion-icons/react/interface';
import { useRouter } from 'next/router';
import { FormNames, useConfirmForm } from 'src/hooks/useDcaInForm';
import useCreateVault from '@hooks/useCreateVault';
import usePageLoad from '@hooks/usePageLoad';
import { Form, Formik, FormikHelpers } from 'formik';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import steps from '@components/NewStrategyModal/steps';
import { TermsModal } from '@components/TermsModal';
import { TransactionType } from '@components/TransactionType';
import Summary from './Summary';
import Fees from '../../../../components/Fees';
import { AgreementCheckbox } from '../../../../components/AgreementCheckbox';
import { getTimeSaved } from '../../../../helpers/getTimeSaved';

function InvalidData() {
  const router = useRouter();
  const { actions } = useConfirmForm(FormNames.DcaIn);

  const handleClick = () => {
    actions.resetAction();
    router.push('/create-strategy/dca-in/assets');
  };
  return (
    <Center>
      {/* Better to link to start of specific strategy */}
      Invalid Data, please&nbsp;
      <Button onClick={handleClick} variant="link">
        restart
      </Button>
    </Center>
  );
}

type AgreementForm = {
  acceptedAgreement: boolean;
};

function ConfirmPurchase() {
  const { state, actions } = useConfirmForm(FormNames.DcaIn);
  const { isPageLoading } = usePageLoad();
  const { nextStep } = useSteps(steps);

  const { mutate, isError, error } = useCreateVault(FormNames.DcaIn, TransactionType.Buy);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(undefined, {
      onSuccess: async (strategyId) => {
        await nextStep({
          strategyId,
          timeSaved:
            state?.initialDeposit && state.swapAmount ? getTimeSaved(state.initialDeposit, state.swapAmount) : 0,
        });
        actions.resetAction();
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });

  const validate = (values: AgreementForm) => {
    if (!values.acceptedAgreement) {
      return { acceptedAgreement: 'You must accept the terms and conditions before continuing.' };
    }

    return {};
  };

  return (
    <>
      <Formik initialValues={{ acceptedAgreement: false }} validate={validate} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <NewStrategyModal>
            <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction}>
              Confirm &amp; Sign
            </NewStrategyModalHeader>
            <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading} isSigning={isSubmitting}>
              {state ? (
                <Form>
                  <Stack spacing={4}>
                    <Summary />
                    <Fees formName={FormNames.DcaIn} />
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
                  </Stack>
                </Form>
              ) : (
                <InvalidData />
              )}
            </NewStrategyModalBody>
          </NewStrategyModal>
        )}
      </Formik>
      <TermsModal showCheckbox={false} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
ConfirmPurchase.getLayout = getFlowLayout;

export default ConfirmPurchase;
