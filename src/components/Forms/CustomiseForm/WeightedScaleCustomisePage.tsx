import { Box, Collapse, Stack } from '@chakra-ui/react';
import useSteps from '@hooks/useSteps';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import DcaDiagram from '@components/DcaDiagram';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import { DcaInFormDataStep2 } from '@models/DcaInFormData';
import { useWeightedScaleCustomiseForm } from '@hooks/useWeightedScaleForm';
import { InvalidData } from '@components/InvalidData';
import SlippageTolerance from '@components/SlippageTolerance';
import ExecutionInterval from '@components/ExecutionInterval';
import BaseSwapAmount from '@components/BaseSwapAmount';
import SwapMultiplier from '@components/SwapMultiplier';
import ApplyMultiplier from '@components/ApplyMultiplier';
import BasePrice from '@components/BasePrice';
import { TriggerForm } from '@components/TriggerForm';
import { StepConfig } from '@formConfig/StepConfig';
import { AnySchema } from 'yup';
import PriceThreshold from '@components/PriceThreshold';
import { useStrategyInfo } from '@hooks/useStrategyInfo';

export function WeightedScaleCustomisePage({ steps, formSchema }: { steps: StepConfig[]; formSchema: AnySchema }) {
  const { actions, state } = useWeightedScaleCustomiseForm();

  const { strategyType, transactionType } = useStrategyInfo();

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
    return <InvalidData onRestart={handleRestart} />;
  }

  const { initialDenom, resultingDenom, route } = state.step1;

  const onSubmit = (data: DcaInFormDataStep2) => {
    actions.updateAction(data);
    nextStep();
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
      {({ values }) => (
        <Form autoComplete="off">
          <Stack direction="column" spacing={4}>
            <DcaDiagram
              initialDenom={initialDenom}
              resultingDenom={resultingDenom}
              initialDeposit={state.step1.initialDeposit}
            />
            <AdvancedSettingsSwitch />
            <Collapse in={values.advancedSettings}>
              <TriggerForm initialDenom={initialDenom} resultingDenom={resultingDenom} />
            </Collapse>
            <ExecutionInterval />
            <BaseSwapAmount initialDenom={initialDenom} initialDeposit={state.step1.initialDeposit} />
            <SwapMultiplier initialDenom={initialDenom} resultingDenom={resultingDenom} />
            <Collapse in={values.advancedSettings}>
              <Box m="px">
                <Stack spacing={4}>
                  <ApplyMultiplier />
                  <BasePrice initialDenom={initialDenom} resultingDenom={resultingDenom} />
                  <PriceThreshold
                    initialDenom={initialDenom}
                    resultingDenom={resultingDenom}
                    transactionType={transactionType}
                    route={route}
                  />
                  <SlippageTolerance />
                </Stack>
              </Box>
            </Collapse>
            <Submit>Next</Submit>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
