import { Box, Collapse, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataPostPurchase, postPurchaseValidationSchema } from 'src/models/DcaInFormData';
import { useDcaInFormPostPurchase } from 'src/hooks/useDcaInForm';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Denom } from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import steps from '@components/NewStrategyModal/steps';
import { useState } from 'react';
import getDenomInfo from '@utils/getDenomInfo';
import SendToWallet from './SendToWallet';
import { AutoStake, DummyAutoStake } from './AutoStake';
import RecipientAccount from './RecipientAccount';
import SendToWalletValues from '../../../../models/SendToWalletValues';
import AutoStakeValidator, { DummyAutoStakeValidator } from './AutoStakeValidator';
import AutoStakeValues from '../../../../models/AutoStakeValues';

function Page() {
  const { actions, state, context } = useDcaInFormPostPurchase();
  const { nextStep } = useSteps(steps);
  const [dummyAutoStake, setDummyAutoStake] = useState(AutoStakeValues.No);

  const stakeingPossible = getDenomInfo(context.resultingDenom).stakeable;

  const stakeingUnsupported = context.resultingDenom !== Denom.Kuji;

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(postPurchaseValidationSchema, { context });

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
            <Form autoComplete="off">
              <Stack direction="column" spacing={6}>
                <SendToWallet />
                <Collapse in={values.sendToWallet === SendToWalletValues.No}>
                  <Box m="px">
                    <RecipientAccount />
                  </Box>
                </Collapse>
                {stakeingPossible && (
                  <Collapse in={values.sendToWallet === SendToWalletValues.Yes}>
                    {stakeingUnsupported ? (
                      <>
                        <DummyAutoStake value={dummyAutoStake} onChange={setDummyAutoStake} />
                        <Collapse in={dummyAutoStake === AutoStakeValues.Yes}>
                          <Box m="px">
                            <DummyAutoStakeValidator />
                          </Box>
                        </Collapse>
                      </>
                    ) : (
                      <>
                        <AutoStake />
                        <Collapse in={values.autoStake === AutoStakeValues.Yes}>
                          <Box m="px">
                            <AutoStakeValidator />
                          </Box>
                        </Collapse>
                      </>
                    )}
                  </Collapse>
                )}
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
