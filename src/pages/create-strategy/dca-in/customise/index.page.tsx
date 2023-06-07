import { Box, Stack, Collapse } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { Form, Formik, useFormikContext } from 'formik';
import { useStep2Form } from 'src/hooks/useDcaInForm';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import ExecutionInterval from '@components/ExecutionInterval';
import DcaDiagram from '@components/DcaDiagram';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import PriceThreshold from '@components/PriceThreshold';
import { DcaInFormDataStep1, DcaInFormDataStep2, step2ValidationSchema } from '@models/DcaInFormData';
import SlippageTolerance from '@components/SlippageTolerance';
import steps from 'src/formConfig/dcaIn';
import { InvalidData } from '@components/InvalidData';
import SwapAmount from '@components/SwapAmount';
import { TriggerForm } from '@components/TriggerForm';
import { FormNames } from '@hooks/useFormStore';
import { CollapseWithRender } from '@components/CollapseWithRender';

function CustomiseFormDcaIn({ step1, resetAction }: { step1: DcaInFormDataStep1; resetAction?: () => void }) {
  const { isPageLoading } = usePageLoad();
  const { values, isSubmitting } = useFormikContext<DcaInFormDataStep2>();
  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={steps} resetForm={resetAction} />
      <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading && !isSubmitting}>
        <Form autoComplete="off">
          <Stack direction="column" spacing={4}>
            <DcaDiagram
              initialDenom={step1.initialDenom}
              resultingDenom={step1.resultingDenom}
              initialDeposit={step1.initialDeposit}
            />
            <AdvancedSettingsSwitch />
            <TriggerForm transactionType={TransactionType.Buy} formName={FormNames.DcaIn} />
            <ExecutionInterval />
            <SwapAmount step1State={step1} />
            <CollapseWithRender isOpen={values.advancedSettings}>
              <PriceThreshold transactionType={TransactionType.Buy} formName={FormNames.DcaIn} />
              <SlippageTolerance />
            </CollapseWithRender>
            <Submit>Next</Submit>
          </Stack>
        </Form>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}

function DcaInStep2() {
  const { actions, state } = useStep2Form(FormNames.DcaIn);

  const { validate } = useValidation(step2ValidationSchema, { ...state?.step1, strategyType: StrategyTypes.DCAIn });
  const { nextStep, goToStep } = useSteps(steps);

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  if (!state) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction} />
        <NewStrategyModalBody stepsConfig={steps} isLoading={false}>
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

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onSubmit={onSubmit}
    >
      <CustomiseFormDcaIn resetAction={actions.resetAction} step1={state.step1} />
    </Formik>
  );
}

DcaInStep2.getLayout = getFlowLayout;

export default DcaInStep2;
