import { Box, Stack, Collapse, Center, Button } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { FormNames } from 'src/hooks/useDcaInForm';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import { StrategyTypes } from '@models/StrategyTypes';
import { StartImmediatelyValues } from '@models/StartImmediatelyValues';
import DcaDiagram from '@components/DcaDiagram';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import { DcaInFormDataStep2 } from '@models/DcaInFormData';
import StartDate from '@components/StartDate';
import StartImmediately from '@components/StartImmediately';
import { dcaPlusInSteps } from 'src/formConfig/dcaPlusIn';
import { useDCAPlusStep2Form } from '@hooks/useDcaPlusForm';
import { DcaPlusCustomiseFormSchema } from '@models/dcaPlusFormData';
import PurchaseTime from '../../../../components/PurchaseTime';
import StartPrice from '../../../../components/DcaInStartPrice';
import StrategyDuration from './StrategyDuration';

function DcaInStep2() {
  const router = useRouter();
  const { actions, state } = useDCAPlusStep2Form(FormNames.DcaPlusIn);

  const steps = dcaPlusInSteps;

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(DcaPlusCustomiseFormSchema, {
    ...state?.step1,
    strategyType: StrategyTypes.DCAIn,
  });
  const { nextStep } = useSteps(steps);

  if (!state) {
    const handleClick = async () => {
      await router.push('/create-strategy/dca-in/assets');
      actions.resetAction();
    };
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction}>
          Customise Strategy
        </NewStrategyModalHeader>
        <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading}>
          <Center>
            {/* Better to link to start of specific strategy */}
            Invalid Data, please&nbsp;
            <Button onClick={handleClick} variant="link">
              restart
            </Button>
          </Center>
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
                <Box>
                  <StartImmediately />
                  <Collapse in={values.startImmediately === StartImmediatelyValues.No}>
                    <Collapse animateOpacity in={values.triggerType === 'date'}>
                      <Box m="px">
                        <StartDate />
                        <Collapse in={values.advancedSettings}>
                          <Box m="px">
                            <PurchaseTime
                              title="Purchase time"
                              subtitle="This is the time of day that your first swap will be made"
                            />
                          </Box>
                        </Collapse>
                      </Box>
                    </Collapse>
                    <Collapse animateOpacity in={values.triggerType === 'price'}>
                      <Box m="px">
                        <StartPrice />
                      </Box>
                    </Collapse>
                  </Collapse>
                </Box>
                <StrategyDuration />
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
