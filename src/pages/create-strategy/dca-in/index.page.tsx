import { Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import { DcaInFormDataStep1, step1ValidationSchema } from 'src/types/DcaInFormData';
import useDcaInForm, { Steps } from 'src/hooks/useDcaInForm';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePairs from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import BaseDenom from './BaseDenom';
import Submit from './Submit';
import QuoteDenom from './QuoteDenom';

function DcaIn() {
  const router = useRouter();
  const { actions, state } = useDcaInForm();
  const { isLoading } = usePairs();

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(step1ValidationSchema);

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await router.push('/create-strategy/dca-in/step2');
  };

  const initialValues = state.step1;

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader resetForm={actions.resetAction}>Choose Funding &amp; Assets</NewStrategyModalHeader>
          <NewStrategyModalBody isLoading={isLoading || (isPageLoading && !isSubmitting)}>
            <Form autoComplete="off">
              <Stack direction="column" spacing={6}>
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
