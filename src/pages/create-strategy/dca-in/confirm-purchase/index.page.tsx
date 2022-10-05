import { Button, Center, Checkbox, FormControl, FormErrorMessage, Stack, Text } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { CheckedIcon } from '@fusion-icons/react/interface';
import { useRouter } from 'next/router';
import useDcaInForm, { useConfirmForm } from 'src/hooks/useDcaInForm';
import useCreateVault from '@hooks/useCreateVault';
import usePageLoad from '@hooks/usePageLoad';
import * as Yup from 'yup';
import { Form, Formik, useField } from 'formik';
import { DcaInFormDataAll } from '../../../../types/DcaInFormData';
import Summary from './Summary';

function Confirm({ values }: { values: DcaInFormDataAll }) {
  const { actions } = useDcaInForm();

  return (
    <Stack spacing={4}>
      <Summary />
      <Button w="full" isLoading={isLoading} rightIcon={<Icon as={CheckedIcon} stroke="navy" />} onClick={handleClick}>
        Confirm
      </Button>
      {isError && (
        <>
          <Text color="red">Something went wrong</Text>
          <Text>{JSON.stringify(error)}</Text>
        </>
      )}
    </Stack>
  );
}

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
  const [field, meta, helpers] = useField('acceptedAgreement');
  return (
    <FormControl isInvalid={meta.touched && !!meta.error}>
      <Checkbox
        isChecked={field.value}
        onChange={field.onChange}
        name={field.name}
        colorScheme="brand"
        size="sm"
        fontSize="xx-small"
      >
        I have read and agree to be bound by the CALC Terms & Conditions.
      </Checkbox>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

function ConfirmPurchase() {
  const { state, actions } = useConfirmForm();
  const { isPageLoading } = usePageLoad();

  const router = useRouter();

  const { mutate, isError, error, isLoading } = useCreateVault();

  const handleSubmit = (props) =>
    mutate(undefined, {
      onSuccess: async () => {
        await router.push('success');
        actions.resetAction();
      },
    });

  const validate = (values) => {
    const errors = {};

    if (!values.acceptedAgreement) {
      errors.acceptedAgreement = 'You must accept the agreement';
    }

    return errors;
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
                  <Button
                    w="full"
                    type="submit"
                    isLoading={isSubmitting}
                    isDisabled={!isValid && Boolean(submitCount)}
                    rightIcon={<Icon as={CheckedIcon} stroke="navy" />}
                  >
                    Confirm
                  </Button>
                  {isError && (
                    <>
                      <Text color="red">Something went wrong</Text>
                      <Text>{JSON.stringify(error)}</Text>
                    </>
                  )}
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
