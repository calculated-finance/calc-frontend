import { Box, Collapse, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { Form, Formik } from 'formik';
import { FormNames } from 'src/hooks/useDcaInForm';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import { StrategyTypes } from '@models/StrategyTypes';
import DcaDiagram from '@components/DcaDiagram';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import { DcaInFormDataStep2 } from '@models/DcaInFormData';
import { dcaPlusInSteps } from 'src/formConfig/dcaPlusIn';
import { useDCAPlusStep2Form } from '@hooks/useDcaPlusForm';
import { DcaPlusCustomiseFormSchema } from '@models/dcaPlusFormData';
import { TriggerForm } from '@components/TriggerForm';
import { TransactionType } from '@components/TransactionType';
import { InvalidData } from '@components/InvalidData';
import SlippageTolerance from '@components/SlippageTolerance';
import StrategyDuration from '@components/StrategyDuration';

function Page() {
  const { actions, state } = useDCAPlusStep2Form(FormNames.DcaPlusIn);
  const steps = dcaPlusInSteps;

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(DcaPlusCustomiseFormSchema, {
    ...state?.step1,
    strategyType: StrategyTypes.DCAPlusIn,
  });
  const { nextStep, goToStep } = useSteps(steps);

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  if (!state) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction}>
          Customise Strategy
        </NewStrategyModalHeader>
        <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading}>
          <InvalidData onRestart={handleRestart} />
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  const onSubmit = async (data: DcaInFormDataStep2) => {
    console.log(data);
    await actions.updateAction(data);
    await nextStep();
  };

  const initialValues = state.step2;

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onSubmit={onSubmit}
    >
      {({ isSubmitting, values }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction}>
            Customise Strategy
          </NewStrategyModalHeader>
          <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading && !isSubmitting}>
            <Form autoComplete="off">
              <Stack direction="column" spacing={4}>
                <DcaDiagram
                  initialDenom={state.step1.initialDenom}
                  resultingDenom={state.step1.resultingDenom}
                  initialDeposit={state.step1.initialDeposit}
                />
                <AdvancedSettingsSwitch />
                <StrategyDuration />
                <Collapse in={values.advancedSettings}>
                  <Box m="px">
                    <SlippageTolerance />
                  </Box>
                </Collapse>
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
