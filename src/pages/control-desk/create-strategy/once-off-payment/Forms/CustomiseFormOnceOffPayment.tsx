import { Stack } from '@chakra-ui/react';
import { Form, Formik, useFormikContext } from 'formik';
import Submit from '@components/Submit';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import SlippageTolerance from '@components/SlippageTolerance';
import { CollapseWithRender } from '@components/CollapseWithRender';
import { useDenom } from '@hooks/useDenom/useDenom';
import { InvalidData } from '@components/InvalidData';
import useSteps from '@hooks/useSteps';
import useValidation from '@hooks/useValidation';
import { StepConfig } from '@formConfig/StepConfig';
import { ControlDeskFormDataStep1, ControlDeskFormDataStep2, step2ValidationSchemaControlDesk } from 'src/pages/control-desk/ControlDeskForms';
import { useControlDeskStrategyInfo } from 'src/pages/control-desk/useControlDeskStrategyInfo';
import { useStep2FormControlDesk } from 'src/pages/control-desk/useOnceOffForm';
import OnceOffDiagram from 'src/pages/control-desk/Components/OnceOffDiagram';
import { TriggerFormOnceOff } from 'src/pages/control-desk/Components/TriggerFormOnceOff';
import PriceThresholdOnceOff from 'src/pages/control-desk/Components/PriceThresholdOnceOff';
import CalcCalculateSwaps from 'src/pages/control-desk/Components/CalcCalculateSwaps';

export function CustomiseFormOnceOff({
  step1,
}: {
  step1: ControlDeskFormDataStep1;
}) {
  const { values } = useFormikContext<ControlDeskFormDataStep2>();
  const initialDenom = useDenom(step1.initialDenom);
  const resultingDenom = useDenom(step1.resultingDenom);

  return (
    <Form autoComplete="off">
      <Stack direction="column" spacing={4}>
        <OnceOffDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} targetAmount={step1.targetAmount} />
        <AdvancedSettingsSwitch />
        <TriggerFormOnceOff />
        <CalcCalculateSwaps initialDenom={initialDenom}
          resultingDenom={resultingDenom} />

        <CollapseWithRender isOpen={values.advancedSettings}>
          <PriceThresholdOnceOff
            initialDenom={initialDenom}
            resultingDenom={resultingDenom}
          />
          <SlippageTolerance />
        </CollapseWithRender>
        <Submit>Next</Submit>
      </Stack>
    </Form>
  );
}

export function CustomiseFormOnceOffWrapper({
  steps,
}: {
  steps: StepConfig[];
}) {
  const { strategyType } = useControlDeskStrategyInfo();
  const { state, actions } = useStep2FormControlDesk();
  const { validate } = useValidation(step2ValidationSchemaControlDesk, { ...state?.step1, strategyType });
  const { goToStep, nextStep } = useSteps(steps);

  const onSubmit = async (data: ControlDeskFormDataStep2) => {
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
      <CustomiseFormOnceOff step1={state.step1} />
    </Formik>
  );
}
