import { Collapse, Stack, Box } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { Form, Formik } from 'formik';
import { useStep2Form } from 'src/hooks/useDcaInForm';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import { StrategyTypes } from '@models/StrategyTypes';
import DcaDiagram from '@components/DcaDiagram';
import { DcaInFormDataStep2, step2ValidationSchema } from '@models/DcaInFormData';
import steps from 'src/formConfig/dcaIn';
import { InvalidData } from '@components/InvalidData';
import { FormNames } from '@hooks/useFormStore';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import { TriggerForm } from '@components/TriggerForm';
import ExecutionInterval from '@components/ExecutionInterval';
import SwapAmount from '@components/SwapAmount';
import PriceThreshold from '@components/PriceThreshold';
import SlippageTolerance from '@components/SlippageTolerance';
import { TransactionType } from '@components/TransactionType';

function DcaInStep2() {
  const { actions, state } = useStep2Form(FormNames.DcaIn);

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(step2ValidationSchema, { ...state?.step1, strategyType: StrategyTypes.DCAIn });
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
    await actions.updateAction(data);
    await nextStep();
  };

  const initialValues = state.step2;
  console.log(state.step1);

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
                <TriggerForm transactionType={TransactionType.Buy} formName={FormNames.DcaIn} />
                <ExecutionInterval />
                {/* <CustomInterval /> */}
                <SwapAmount step1State={state.step1} />
                {/* <SwapIntervals step1State={state.step1} /> */}
                <Collapse in={values.advancedSettings}>
                  <Box m="px">
                    <PriceThreshold
                      transactionType={TransactionType.Buy}
                      formName={FormNames.DcaIn}
                      title="Set buy price ceiling?"
                      description="CALC won't buy if the asset price exceeds this set value."
                    />
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

DcaInStep2.getLayout = getFlowLayout;

export default DcaInStep2;
