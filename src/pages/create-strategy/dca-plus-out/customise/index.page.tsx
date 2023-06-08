import { Box, Collapse, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import DcaDiagram from '@components/DcaDiagram';
import { StrategyTypes } from '@models/StrategyTypes';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import { DcaInFormDataStep2 } from '@models/DcaInFormData';
import { InvalidData } from '@components/InvalidData';
import { useDCAPlusStep2Form } from '@hooks/useDcaPlusForm';
import { DcaPlusCustomiseFormSchema } from '@models/dcaPlusFormData';
import StrategyDuration from '@components/StrategyDuration';
import SlippageTolerance from '@components/SlippageTolerance';
import dcaPlusOutSteps from '@formConfig/dcaPlusOut';
import { FormNames } from '@hooks/useFormStore';
import getDenomInfo from '@utils/getDenomInfo';

function Page() {
  const { actions, state } = useDCAPlusStep2Form(FormNames.DcaPlusOut);
  const steps = dcaPlusOutSteps;

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(DcaPlusCustomiseFormSchema, {
    ...state?.step1,
    strategyType: StrategyTypes.DCAPlusOut,
  });
  const { nextStep, goToStep } = useSteps(steps);

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  if (!state) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction} />
        <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading}>
          <InvalidData onRestart={handleRestart} />
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  const onSubmit = async (data: DcaInFormDataStep2) => {
    await actions.updateAction(data);
    await nextStep();
  };

  const initialValues = state.step2;
  const initialDenom = getDenomInfo(state.step1.initialDenom);
  const resultingDenom = getDenomInfo(state.step1.resultingDenom);

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
          <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction} />
          <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading && !isSubmitting}>
            <Form autoComplete="off">
              <Stack direction="column" spacing={4}>
                <DcaDiagram
                  initialDenom={initialDenom}
                  resultingDenom={resultingDenom}
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
