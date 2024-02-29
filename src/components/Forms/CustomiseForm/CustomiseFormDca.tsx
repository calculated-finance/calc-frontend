import { Stack } from '@chakra-ui/react';
import { Form, Formik, useField, useFormikContext } from 'formik';
import Submit from '@components/Submit';
import ExecutionInterval from '@components/ExecutionInterval';
import DcaDiagram from '@components/DcaDiagram';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import PriceThreshold from '@components/PriceThreshold';
import { DcaInFormDataStep1, DcaInFormDataStep2, step2ValidationSchema } from '@models/DcaInFormData';
import SlippageTolerance from '@components/SlippageTolerance';
import SwapAmount from '@components/SwapAmount';
import { TriggerForm } from '@components/TriggerForm';
import { CollapseWithRender } from '@components/CollapseWithRender';
import { InvalidData } from '@components/InvalidData';
import { useDcaInCustomiseForm } from '@hooks/useDcaInForm';
import useSteps from '@hooks/useSteps';
import useValidation from '@hooks/useValidation';
import { StepConfig } from '@formConfig/StepConfig';
import { useStrategyInfo } from '@hooks/useStrategyInfo';
import { TransactionType } from '@components/TransactionType';

export function CustomiseFormDca({
  step1: { initialDeposit, initialDenom, resultingDenom },
  transactionType,
}: {
  step1: DcaInFormDataStep1;
  transactionType: TransactionType;
}) {
  const {
    values: { advancedSettings },
  } = useFormikContext<DcaInFormDataStep2>();
  const [, routeMeta] = useField({ name: 'route' });

  return (
    <Form autoComplete="off">
      <Stack direction="column" spacing={4}>
        <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={initialDeposit} />
        <AdvancedSettingsSwitch />
        <TriggerForm initialDenom={initialDenom} resultingDenom={resultingDenom} />
        <ExecutionInterval />
        <SwapAmount
          transactionType={transactionType}
          isEdit={false}
          initialDenom={initialDenom}
          resultingDenom={resultingDenom}
          initialDeposit={initialDeposit}
        />
        <CollapseWithRender isOpen={advancedSettings}>
          <PriceThreshold
            initialDenom={initialDenom}
            resultingDenom={resultingDenom}
            transactionType={transactionType}
          />
          <SlippageTolerance />
        </CollapseWithRender>
        <Submit isDisabled={!routeMeta.touched || !!routeMeta.error}>Next</Submit>
      </Stack>
    </Form>
  );
}

export function CustomiseFormDcaWrapper({ steps }: { steps: StepConfig[] }) {
  const { strategyType, transactionType } = useStrategyInfo();
  const { state, actions } = useDcaInCustomiseForm();
  const { validate } = useValidation(step2ValidationSchema, { ...state?.step1, strategyType });
  const { goToStep, nextStep } = useSteps(steps);

  const onSubmit = (data: DcaInFormDataStep2) => {
    actions.updateAction(data);
    nextStep();
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
