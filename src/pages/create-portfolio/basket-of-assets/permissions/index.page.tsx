import { Box, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { basketOfAssetsSteps, DcaInFormDataPostPurchase } from 'src/models/DcaInFormData';
import { FormNames } from 'src/hooks/useDcaInForm';
import useFormSchema from 'src/hooks/useFormSchema';

import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import { PortfolioDiagram } from '@components/PortfolioDiagram';
import BasketManager from './BasketManager';
import { CopierCharge } from './CopierCharge';
import steps from '../steps';

function Page() {
  const {
    actions,
    state: [state, step1],
  } = useFormSchema(FormNames.BasketOfAssets, basketOfAssetsSteps, 3);
  const { nextStep } = useSteps(steps);
  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(basketOfAssetsSteps[3]);

  const onSubmit = async (formData: DcaInFormDataPostPurchase) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={state} validate={validate} onSubmit={onSubmit}>
      {({ values, isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction}>
            Post Purchase
          </NewStrategyModalHeader>
          <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading && !isSubmitting}>
            {state ? (
              <Form autoComplete="off">
                <Stack direction="column" spacing={6}>
                  <PortfolioDiagram portfolio={step1.portfolioDenoms} />
                  <CopierCharge />
                  <Submit>Next</Submit>
                </Stack>
              </Form>
            ) : (
              <Box> Invalid data </Box> // TODO: do this properly
            )}
          </NewStrategyModalBody>
        </NewStrategyModal>
      )}
    </Formik>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
