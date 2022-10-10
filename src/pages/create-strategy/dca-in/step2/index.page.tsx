import { Box, Stack, Collapse, Center, Button, Flex, Switch, Text } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { Form, Formik, useField } from 'formik';
import { useRouter } from 'next/router';
import { useStep2Form } from 'src/hooks/useDcaInForm';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import steps from '@components/NewStrategyModal/steps';
import { DcaInFormDataStep2, step2ValidationSchema } from '../../../../types/DcaInFormData';
import ExecutionInterval from './ExecutionInterval';
import StartDate from './StartDate';
import StartImmediately from './StartImmediately';
import { StartImmediatelyValues } from './StartImmediatelyValues';
import SwapAmount from './SwapAmount';
import DcaInDiagram from '../confirm-purchase/DcaInDiagram';
import PurchaseTime from './PurchaseTime';
import SlippageTolerance from './SlippageTolerance';
import StartPrice from './StartPrice';

function AdvancedSettingsSwitch() {
  const [field] = useField('advancedSettings');

  return (
    <Flex justify="end">
      <Text mr={2} textStyle="body-xs">
        Advanced Settings
      </Text>
      <Switch size="sm" colorScheme="brand" isChecked={field.value} onChange={field.onChange} name={field.name} />
    </Flex>
  );
}

function DcaInStep2() {
  const router = useRouter();
  const { actions, state } = useStep2Form();

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(step2ValidationSchema, { ...state?.step1 });
  const { nextStep } = useSteps(steps);

  if (!state) {
    const handleClick = async () => {
      await router.push('/create-strategy/dca-in');
      actions.resetAction();
    };
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader resetForm={actions.resetAction}>Customise Strategy</NewStrategyModalHeader>
        <NewStrategyModalBody isLoading={isPageLoading}>
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
          <NewStrategyModalHeader resetForm={actions.resetAction}>Customise Strategy</NewStrategyModalHeader>
          <NewStrategyModalBody isLoading={isPageLoading && !isSubmitting}>
            <Form autoComplete="off">
              <Stack direction="column" spacing={4}>
                <DcaInDiagram
                  quoteDenom={state.step1.quoteDenom}
                  baseDenom={state.step1.baseDenom}
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
                  <SlippageTolerance />
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
