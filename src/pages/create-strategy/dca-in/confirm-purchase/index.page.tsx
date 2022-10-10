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
import Summary from './Summary';

function InvalidData() {
  const router = useRouter();
  const { actions } = useConfirmForm();

  const handleClick = () => {
    actions.resetAction();
    router.push('/create-strategy/dca-in');
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

function AgreementCheckbox() {
  const [field, meta] = useField('acceptedAgreement');
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(field);

  return (
    <FormControl isInvalid={meta.touched && !!meta.error}>
      <chakra.label display="flex" flexDirection="row" alignItems="center" cursor="pointer" {...htmlProps}>
        <Text textStyle="body-xs" {...getLabelProps()} mr={2}>
          I have read and agree to be bound by the CALC Terms & Conditions.
        </Text>

        <input {...getInputProps()} hidden />
        <Flex
          alignItems="center"
          justifyContent="center"
          border="1px solid"
          borderRadius="sm"
          borderColor="white"
          bg={state.isChecked ? 'brand.200' : 'none'}
          w={4}
          h={4}
          {...getCheckboxProps()}
        >
          {state.isChecked && <Icon as={FiCheck} w={3} h={3} />}
        </Flex>
      </chakra.label>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

type AgreementForm = {
  acceptedAgreement: boolean;
};

function ConfirmPurchase() {
  const { state, actions } = useConfirmForm();
  const { isPageLoading } = usePageLoad();

  const router = useRouter();

  const { mutate, isError, error } = useCreateVault();

  const timeSaved =
    state?.initialDeposit && state.swapAmount ? totalExecutions(state?.initialDeposit, state.swapAmount) * 10 : 0;

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(undefined, {
      onSuccess: async () => {
        await router.push(`success?time_saved=${timeSaved}`);
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
      {({ isSubmitting, isValid, submitCount }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader resetForm={actions.resetAction}>Confirm &amp; Sign</NewStrategyModalHeader>
          <NewStrategyModalBody isLoading={isPageLoading}>
            {state ? (
              <Form>
                <Stack spacing={4}>
                  <Summary />
                  <AgreementCheckbox />
                  <FormControl isInvalid={isError}>
                    <Button
                      w="full"
                      type="submit"
                      isLoading={isSubmitting}
                      isDisabled={!isValid && Boolean(submitCount)}
                      rightIcon={<Icon as={CheckedIcon} stroke="navy" />}
                    >
                      Confirm
                    </Button>
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
  );
}
ConfirmPurchase.getLayout = getFlowLayout;

export default ConfirmPurchase;
