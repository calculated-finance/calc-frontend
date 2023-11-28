import { Box, Collapse, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
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
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { useDenom } from '@hooks/useDenom/useDenom';
import { ModalWrapper } from '@components/ModalWrapper';
import { TransactionType } from '@components/TransactionType';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  const { actions, state } = useDCAPlusStep2Form();
  const steps = dcaPlusOutSteps;

  const { validate } = useValidation(DcaPlusCustomiseFormSchema, {
    ...state?.step1,
    strategyType: StrategyTypes.DCAPlusOut,
  });
  const { nextStep, goToStep } = useSteps(steps);

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  const initialDenom = useDenom(state?.step1.initialDenom);
  const resultingDenom = useDenom(state?.step1.resultingDenom);

  if (!state) {
    return <InvalidData onRestart={handleRestart} />;
  }

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
            <StrategyDuration />
            <Collapse in={values.advancedSettings}>
              <Box m="px">
                <SlippageTolerance />
              </Box>
            </Collapse>
            <Submit>Next</Submit>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}

function PageWrapper() {
  const { resetForm } = useFormStore();

  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.DCAPlusOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.DcaPlusOut,
      }}
    >
      <ModalWrapper stepsConfig={dcaPlusOutSteps} reset={resetForm(FormNames.DcaPlusOut)}>
        <Page />
      </ModalWrapper>
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
