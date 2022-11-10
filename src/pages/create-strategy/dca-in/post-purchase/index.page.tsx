import { Box, Button, Center, Collapse, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataPostPurchase, postPurchaseValidationSchema } from 'src/models/DcaInFormData';
import { FormNames, useConfirmForm, useDcaInFormPostPurchase } from 'src/hooks/useDcaInForm';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Denoms } from '@models/Denom';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import steps from '@components/NewStrategyModal/steps';
import { useState } from 'react';
import getDenomInfo from '@utils/getDenomInfo';
import { useRouter } from 'next/router';
import SendToWallet from './SendToWallet';
import { AutoStake, DummyAutoStake } from './AutoStake';
import RecipientAccount from './RecipientAccount';
import SendToWalletValues from '../../../../models/SendToWalletValues';
import AutoStakeValidator, { DummyAutoStakeValidator } from './AutoStakeValidator';
import AutoStakeValues from '../../../../models/AutoStakeValues';

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
  const { actions, state, context } = useDcaInFormPostPurchase(FormNames.DcaIn);
  const { nextStep } = useSteps(steps);
  const [dummyAutoStake, setDummyAutoStake] = useState(AutoStakeValues.No);
  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(postPurchaseValidationSchema, { context });

  const stakeingPossible = getDenomInfo(context?.resultingDenom).stakeable;

  const stakeingUnsupported = context?.resultingDenom !== Denoms.Kuji;

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
