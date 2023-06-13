import { Stack } from '@chakra-ui/react';
import { Form, Formik, useFormikContext } from 'formik';
import Submit from '@components/Submit';
import { TransactionType } from '@components/TransactionType';
import ExecutionInterval from '@components/ExecutionInterval';
import DcaDiagram from '@components/DcaDiagram';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import PriceThreshold from '@components/PriceThreshold';
import { DcaInFormDataStep1, DcaInFormDataStep2, step2ValidationSchema } from '@models/DcaInFormData';
import SlippageTolerance from '@components/SlippageTolerance';
import SwapAmount from '@components/SwapAmount';
import { TriggerForm } from '@components/TriggerForm';
import { CollapseWithRender } from '@components/CollapseWithRender';
import { useDenom } from '@hooks/useDenom/useDenom';
import { InvalidData } from '@components/InvalidData';
import { useStep2Form } from '@hooks/useDcaInForm';
import { FormNames } from '@hooks/useFormStore';
import useSteps from '@hooks/useSteps';
import useValidation from '@hooks/useValidation';
import { StrategyTypes } from '@models/StrategyTypes';
import { StepConfig } from '@formConfig/StepConfig';

export function CustomiseFormDca({
  step1,
  transactionType,
}: {
  step1: DcaInFormDataStep1;
  transactionType: TransactionType;
}) {
  const { values } = useFormikContext<DcaInFormDataStep2>();

  const initialDenom = useDenom(step1.initialDenom);
  const resultingDenom = useDenom(step1.resultingDenom);
  return (
    <Form autoComplete="off">
      <Stack direction="column" spacing={4}>
        <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={step1.initialDeposit} />
        <AdvancedSettingsSwitch />
        <TriggerForm transactionType={transactionType} initialDenom={initialDenom} resultingDenom={resultingDenom} />
        <ExecutionInterval />
        <SwapAmount step1State={step1} isSell={transactionType === TransactionType.Sell} />
        <CollapseWithRender isOpen={values.advancedSettings}>
          <PriceThreshold
            initialDenom={initialDenom}
            resultingDenom={resultingDenom}
            transactionType={transactionType}
          />
          <SlippageTolerance />
        </CollapseWithRender>
        <Submit>Next</Submit>
      </Stack>
    </Form>
  );
}

export function CustomiseFormDcaWrapper({
  formName,
  strategyType,
  steps,
  transactionType,
}: {
  formName: FormNames;
  strategyType: StrategyTypes;
  steps: StepConfig[];
  transactionType: TransactionType;
}) {
  const { state, actions } = useStep2Form(formName);
  const { validate } = useValidation(step2ValidationSchema, { ...state?.step1, strategyType });
  const { goToStep, nextStep } = useSteps(steps);

  const onSubmit = async (data: DcaInFormDataStep2) => {
    await actions.updateAction(data);
    await nextStep();
  };

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  if (!state) {
    return <InvalidData onRestart={handleRestart} />;
  }

  const initialValues = state.step2;

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onSubmit={onSubmit}
    >
      <CustomiseFormDca step1={state.step1} transactionType={transactionType} />
    </Formik>
  );
}
