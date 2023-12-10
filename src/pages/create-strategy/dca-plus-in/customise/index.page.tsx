import { Box, Collapse, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import useSteps from '@hooks/useSteps';
import { Form, Formik } from 'formik';
import { FormNames, useFormStore } from 'src/hooks/useFormStore';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import { StrategyType } from '@models/StrategyType';
import DcaDiagram from '@components/DcaDiagram';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import { DcaInFormDataStep2 } from '@models/DcaInFormData';
import { dcaPlusInSteps } from 'src/formConfig/dcaPlusIn';
import { useDCAPlusStep2Form } from '@hooks/useDcaPlusForm';
import { DcaPlusCustomiseFormSchema } from '@models/dcaPlusFormData';
import { InvalidData } from '@components/InvalidData';
import SlippageTolerance from '@components/SlippageTolerance';
import StrategyDuration from '@components/StrategyDuration';
import { useDenom } from '@hooks/useDenom/useDenom';
import { ModalWrapper } from '@components/ModalWrapper';
import { TransactionType } from '@components/TransactionType';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  const { actions, state } = useDCAPlusStep2Form();
  const steps = dcaPlusInSteps;

  const { validate } = useValidation(DcaPlusCustomiseFormSchema, {
    ...state?.step1,
    strategyType: StrategyType.DCAPlusIn,
  });
  const { nextStep, goToStep } = useSteps(steps);

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  const initialDenom = useDenom(state?.step1.initialDenom);
  const resulingDenom = useDenom(state?.step1.resultingDenom);

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
              resultingDenom={resulingDenom}
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
        strategyType: StrategyType.DCAPlusIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaPlusIn,
      }}
    >
      <ModalWrapper stepsConfig={dcaPlusInSteps} reset={resetForm(FormNames.DcaPlusIn)}>
        <Page />
      </ModalWrapper>
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
