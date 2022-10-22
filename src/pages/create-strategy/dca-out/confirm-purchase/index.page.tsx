import {
  Button,
  Center,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  Stack,
  Text,
  useCheckbox,
} from '@chakra-ui/react';
import Icon from '@components/Icon';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { CheckedIcon } from '@fusion-icons/react/interface';
import { useRouter } from 'next/router';
import { useConfirmForm } from 'src/hooks/useDcaInForm';
import useCreateVault from '@hooks/useCreateVault';
import usePageLoad from '@hooks/usePageLoad';
import { Form, Formik, FormikHelpers, useField } from 'formik';
import { FiCheck } from 'react-icons/fi';
import totalExecutions from '@utils/totalExecutions';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import steps from '@components/NewStrategyModal/steps';
import { AgreementCheckbox } from '@components/AgreementCheckbox';
import Summary from './Summary';
import dcaOutSteps from '../dcaOutSteps';
import Fees from '../../../../components/Fees';

function InvalidData() {
  const router = useRouter();
  const { actions } = useConfirmForm();

  const handleClick = () => {
    actions.resetAction();
    router.push('/create-strategy/assets');
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
  const { state, actions } = useConfirmForm();
  const { isPageLoading } = usePageLoad();
  const { nextStep } = useSteps(dcaOutSteps);

  const { mutate, isError, error } = useCreateVault('exit');

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(undefined, {
      onSuccess: async (data) => {
        await nextStep({
          strategyId: data.logs[0].events
            .find((event) => event.type === 'wasm')
            ?.attributes.find((attribute) => attribute.key === 'vault_id')?.value,
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
    <Formik initialValues={{ acceptedAgreement: false }} validate={validate} onSubmit={handleSubmit}>
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={dcaOutSteps} resetForm={actions.resetAction}>
          Confirm &amp; Sign
        </NewStrategyModalHeader>
        <NewStrategyModalBody stepsConfig={dcaOutSteps} isLoading={isPageLoading}>
          {state ? (
            <Form>
              <Stack spacing={4}>
                <Summary />
                <Fees />
                <AgreementCheckbox />
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
    </Formik>
  );
}
ConfirmPurchase.getLayout = getFlowLayout;

export default ConfirmPurchase;
