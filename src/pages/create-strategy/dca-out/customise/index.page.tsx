import { Box, Stack, Collapse } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { Form, Formik } from 'formik';
import { useStep2Form } from 'src/hooks/useDcaInForm';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import DcaDiagram from '@components/DcaDiagram';
import PriceThreshold from '@components/PriceThreshold';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import ExecutionInterval from '@components/ExecutionInterval';
import { DcaInFormDataStep2, step2ValidationSchema } from '@models/DcaInFormData';
import SlippageTolerance from '@components/SlippageTolerance';
import { TriggerForm } from '@components/TriggerForm';
import { InvalidData } from '@components/InvalidData';
import SwapAmount from '@components/SwapAmount';
import dcaOutSteps from '@formConfig/dcaOut';
import { FormNames } from '@hooks/useFormStore';

function Page() {
  const { actions, state } = useStep2Form(FormNames.DcaOut);

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(step2ValidationSchema, { ...state?.step1, strategyType: StrategyTypes.DCAOut });
  const { nextStep, goToStep } = useSteps(dcaOutSteps);

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  if (!state) {
    // TODO: clean this up so we dont need two modal codes
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={dcaOutSteps} resetForm={actions.resetAction}>
          Customise Strategy
        </NewStrategyModalHeader>
        <NewStrategyModalBody stepsConfig={dcaOutSteps} isLoading={isPageLoading}>
          <InvalidData onRestart={handleRestart} />
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }
  const onSubmit = async (data: DcaInFormDataStep2) => {
    await actions.updateAction(data);
    await nextStep();
  };

  const initialValues = state?.step2;

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader stepsConfig={dcaOutSteps} resetForm={actions.resetAction}>
            Customise Strategy
          </NewStrategyModalHeader>
          <NewStrategyModalBody stepsConfig={dcaOutSteps} isLoading={isPageLoading && !isSubmitting}>
            <Form autoComplete="off">
              <Stack direction="column" spacing={4}>
                <DcaDiagram
                  initialDenom={state.step1.initialDenom}
                  resultingDenom={state.step1.resultingDenom}
                  initialDeposit={state.step1.initialDeposit}
                />
                <AdvancedSettingsSwitch />
                <TriggerForm transactionType={TransactionType.Sell} formName={FormNames.DcaOut} />
                <ExecutionInterval />
                <SwapAmount step1State={state.step1} isSell />
                <Collapse in={values.advancedSettings}>
                  <Box m="px">
                    <Stack spacing={4}>
                      <PriceThreshold transactionType={TransactionType.Sell} formName={FormNames.DcaOut} />
                      <SlippageTolerance />
                    </Stack>
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
