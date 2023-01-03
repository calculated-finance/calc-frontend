import { Box, Stack, Collapse, Center, Button } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { FormNames, useStep2Form } from 'src/hooks/useDcaInForm';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import steps from '@components/NewStrategyModal/steps';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import { DcaInFormDataStep2, step2ValidationSchema } from '../../../../models/DcaInFormData';
import ExecutionInterval from './ExecutionInterval';
import StartDate from './StartDate';
import StartImmediately from './StartImmediately';
import { StartImmediatelyValues } from '../../../../models/StartImmediatelyValues';
import SwapAmount from './SwapAmount';
import DcaDiagram from '../../../../components/DcaDiagram';
import PurchaseTime from './PurchaseTime';
import SlippageTolerance from './SlippageTolerance';
import StartPrice from './StartPrice';
import AdvancedSettingsSwitch from './AdvancedSettingsSwitch';
import PriceThreshold from '../../../../components/PriceThreshold';

function DcaInStep2() {
  const router = useRouter();
  const { actions, state } = useStep2Form(FormNames.DcaIn);

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(step2ValidationSchema, { ...state?.step1, strategyType: StrategyTypes.DCAIn });
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
                            <PurchaseTime />
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
                <ExecutionInterval />
                <SwapAmount step1State={state.step1} />
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
