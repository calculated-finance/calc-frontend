import { Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import DcaInFormData, { step1ValidationSchema } from 'src/types/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePairs from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import BaseDenom from './BaseDenom';
import Submit from './Submit';
import QuoteDenom from './QuoteDenom';

function DcaIn() {
  const router = useRouter();
  const { actions, state } = useDcaInForm();
  const { isLoading } = usePairs();

  const { isPageLoading } = usePageLoad();

  const onSubmit = async (formData: DcaInFormData['step1']) => {
    await actions.updateAction({ ...state, step1: formData });
    await router.push('/create-strategy/dca-in/step2');
  };

  const initialValues = state.step1;

  return (
    <Formik initialValues={initialValues} validationSchema={step1ValidationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader resetForm={actions.resetAction}>Choose Funding &amp; Assets</NewStrategyModalHeader>
          <NewStrategyModalBody isLoading={isLoading || (isPageLoading && !isSubmitting)}>
            <Form>
              <Stack direction="column" spacing={4}>
                <QuoteDenom />
                <BaseDenom />
                <Submit />
              </Stack>
            </Form>
          </NewStrategyModalBody>
        </NewStrategyModal>
      )}
    </Formik>
  );
}

DcaIn.getLayout = getFlowLayout;

export default DcaIn;
