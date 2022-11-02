import { Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1, step1ValidationSchema } from 'src/models/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePairs from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import steps from '@components/NewStrategyModal/steps';
import useBalances from '@hooks/useBalances';
import ResultingDenom from '../ResultingDenom';
import InitialDenom from '../InitialDenom';

function DcaIn() {
  const { actions, state } = useDcaInForm();
  const { isLoading } = usePairs();
  const { nextStep } = useSteps(steps);

  const { data } = useBalances();

  const { isPageLoading } = usePageLoad();

  const { validate } = useValidation(step1ValidationSchema, { balances: data?.balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  const initialValues = state.step1;

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction}>
            Choose Funding &amp; Assets
          </NewStrategyModalHeader>
          <NewStrategyModalBody stepsConfig={steps} isLoading={isLoading || (isPageLoading && !isSubmitting)}>
            <Form autoComplete="off">
              <Stack direction="column" spacing={6}>
                <InitialDenom />
                <ResultingDenom />
                <Submit>Next</Submit>
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
