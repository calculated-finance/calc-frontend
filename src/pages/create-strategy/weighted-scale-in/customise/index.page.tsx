import { Box, Collapse, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { Form, Formik } from 'formik';
import { FormNames } from 'src/hooks/useFormStore';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import { StrategyTypes } from '@models/StrategyTypes';
import DcaDiagram from '@components/DcaDiagram';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import { DcaInFormDataStep2 } from '@models/DcaInFormData';
import { weightedScaleInSteps } from 'src/formConfig/weightedScaleIn';
import { useWeightedScaleStep2Form } from '@hooks/useWeightedScaleForm';
import { WeightedScaleCustomiseFormSchema } from '@models/weightedScaleFormData';
import { InvalidData } from '@components/InvalidData';
import SlippageTolerance from '@components/SlippageTolerance';
import ExecutionInterval from '@components/ExecutionInterval';
import BaseSwapAmount from '@components/BaseSwapAmount';
import SwapMultiplier from '@components/SwapMultiplier';
import ApplyMultiplier from '@components/ApplyMultiplier';
import BasePrice from '@components/BasePrice';
import { TransactionType } from '@components/TransactionType';
import { TriggerForm } from '@components/TriggerForm';
import { StepConfig } from '@formConfig/StepConfig';
import { AnySchema } from 'yup';

export function WeightedScaleCustomisePage({
  formName,
  steps,
  strategyType,
  transactionType,
  formSchema,
}: {
  formName: FormNames;
  steps: StepConfig[];
  strategyType: StrategyTypes;
  transactionType: TransactionType;
  formSchema: AnySchema;
}) {
  const { actions, state } = useWeightedScaleStep2Form(formName);

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(formSchema, {
    ...state?.step1,
    strategyType,
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
                <Collapse in={values.advancedSettings}>
                  <TriggerForm transactionType={transactionType} formName={formName} />
                </Collapse>
                <ExecutionInterval />
                <BaseSwapAmount step1State={state.step1} />
                <SwapMultiplier
                  initialDenom={state.step1.initialDenom}
                  resultingDenom={state.step1.resultingDenom}
                  transactionType={transactionType}
                />
                <ApplyMultiplier />
                <BasePrice formName={formName} transactionType={transactionType} />
                <Collapse in={values.advancedSettings}>
                  <ApplyMultiplier />
                  <BasePrice formName={formName} transactionType={transactionType} />
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

function Page() {
  return (
    <WeightedScaleCustomisePage
      formName={FormNames.WeightedScaleIn}
      steps={weightedScaleInSteps}
      strategyType={StrategyTypes.WeightedScaleIn}
      transactionType={TransactionType.Buy}
      formSchema={WeightedScaleCustomiseFormSchema}
    />
  );
}

Page.getLayout = getFlowLayout;

export default Page;
