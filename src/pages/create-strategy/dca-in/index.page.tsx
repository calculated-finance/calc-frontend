import { Center, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import DcaInFormData from 'src/types/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePairs from '@hooks/usePairs';
import Spinner from '@components/Spinner';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import BaseDenom from './BaseDenom';
import Submit from './Submit';
import QuoteDenom from './QuoteDenom';

function DcaIn() {
  const router = useRouter();
  const { actions, state } = useDcaInForm();
  const { data: pairsData, isLoading } = usePairs();

  const onSubmit = async (formData: DcaInFormData['step1']) => {
    await actions.updateAction({ ...state, step1: formData });
    await router.push('/create-strategy/dca-in/step2');
  };

  const initialValues = state.step1;

  const validationSchema = Yup.object({
    baseDenom: Yup.string().required(),
    quoteDenom: Yup.string().required(),
    initialDeposit: Yup.number().positive().required(),
  });

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader resetForm={actions.resetAction}>Choose Funding &amp; Assets</NewStrategyModalHeader>
      <NewStrategyModalBody>
        {isLoading || !pairsData ? (
          <Center h={56}>
            <Spinner />
          </Center>
        ) : (
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            <Form>
              <Stack direction="column" spacing={4}>
                <QuoteDenom />
                <BaseDenom />
                <Submit />
              </Stack>
            </Form>
          </Formik>
        )}
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}

DcaIn.getLayout = getFlowLayout;

export default DcaIn;
