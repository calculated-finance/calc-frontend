import { Button, Center, FormControl, FormErrorMessage, Stack, useDisclosure, Text } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { CheckedIcon } from '@fusion-icons/react/interface';
import { useRouter } from 'next/router';
import { FormNames, useConfirmForm, useFormSchema } from 'src/hooks/useDcaInForm';
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
import { basketOfAssetsSteps } from '@models/DcaInFormData';
import { useMutation } from '@tanstack/react-query';
import { Strategy } from '@hooks/useStrategies';
import useValidation from '@hooks/useValidation';

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
  const {
    state: [state, step1, step2, step3, step4],
    actions,
  } = useFormSchema(FormNames.BasketOfAssets, basketOfAssetsSteps, 4);
  const { isPageLoading } = usePageLoad();
  const { nextStep } = useSteps(steps);

  const { mutate, isError, error } = useMutation<Strategy['id'], Error>(() => '1');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const validate = useValidation(basketOfAssetsSteps[4]);

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(undefined, {
      onSuccess: async (strategyId) => {
        await nextStep({
          strategyId,
        });
        actions.resetAction(); //TODO fix
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*  @ts-ignore */}
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
                    <Text>{JSON.stringify(step1)}</Text>
                    <Text>{JSON.stringify(step2)}</Text>
                    <Text>{JSON.stringify(step3)}</Text>
                    <Text>{JSON.stringify(step4)}</Text>
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
