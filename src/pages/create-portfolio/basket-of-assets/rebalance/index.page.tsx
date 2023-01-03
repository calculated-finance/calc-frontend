import { Box, Button, Center, Collapse, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { basketOfAssetsSteps, DcaInFormDataPostPurchase } from 'src/models/DcaInFormData';
import { FormNames, useConfirmForm } from 'src/hooks/useDcaInForm';
import useFormSchema from 'src/hooks/useFormSchema';

import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import { useState } from 'react';
import { useRouter } from 'next/router';
import RebalanceMode from './RebalanceMode';
import RecipientAccount from './RecipientAccount';
import SendToWalletValues from '../../../../models/SendToWalletValues';
import AutoStakeValues from '../../../../models/AutoStakeValues';
import steps from '../steps';
import { PortfolioDiagram } from '@components/PortfolioDiagram';

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

function Page() {
  const {
    actions,
    state: [state, step1],
  } = useFormSchema(FormNames.BasketOfAssets, basketOfAssetsSteps, 2);
  const { nextStep } = useSteps(steps);
  const [dummyAutoStake, setDummyAutoStake] = useState(AutoStakeValues.No);
  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(basketOfAssetsSteps[2]);

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
                  <RebalanceMode />
                  <Collapse in={values.sendToWallet === SendToWalletValues.No}>
                    <Box m="px">
                      <RecipientAccount />
                    </Box>
                  </Collapse>
                  <Submit>Next</Submit>
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

Page.getLayout = getFlowLayout;

export default Page;
