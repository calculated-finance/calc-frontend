import { Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { basketOfAssetsStep1, basketOfAssetsSteps, DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import { FormNames } from 'src/hooks/useDcaInForm';
import useFormSchema from 'src/hooks/useFormSchema';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePairs from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import useBalances from '@hooks/useBalances';
import PortfolioDenoms from '../PortfolioDenoms';
import steps from '../steps';

function Page() {
  const {
    actions,
    state: [step1],
  } = useFormSchema(FormNames.BasketOfAssets, basketOfAssetsSteps, 0);
  const { isLoading } = usePairs();
  const { nextStep } = useSteps(steps);

  const { data } = useBalances();

  const { isPageLoading } = usePageLoad();

  const { validate } = useValidation(basketOfAssetsSteps[0], { balances: data?.balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  const initialValues = step1;

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
                <PortfolioDenoms />
                <Submit>Next</Submit>
              </Stack>
            </Form>
          </NewStrategyModalBody>
        </NewStrategyModal>
      )}
    </Formik>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
