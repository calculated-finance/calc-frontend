import { Box, Stack, Collapse, Center, Button, Divider } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useStep2Form } from 'src/hooks/useDcaInForm';
import useValidation from '@hooks/useValidation';
import { DcaInFormDataStep2, step2ValidationSchema } from '../../../../types/DcaInFormData';
import ExecutionInterval from './ExecutionInterval';
import StartDate from './StartDate';
import StartImmediately from './StartImmediately';
import { StartImmediatelyValues } from './StartImmediatelyValues';
import Submit from './Submit';
import SwapAmount from './SwapAmount';
import { DcaInDiagram } from '../confirm-purchase/index.page';

function DcaInStep2() {
  const router = useRouter();
  const { actions, state } = useStep2Form();

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(step2ValidationSchema, { ...state?.step1 });

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
    await router.push('/create-strategy/dca-in/confirm-purchase');
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
            <Form>
              <Stack direction="column" spacing={4}>
                <DcaInDiagram
                  quoteDenom={state.step1.quoteDenom}
                  baseDenom={state.step1.baseDenom}
                  initialDeposit={state.step1.initialDeposit}
                />
                <Divider />
                <Box>
                  <StartImmediately />
                  <Collapse in={values.startImmediately === StartImmediatelyValues.No}>
                    <StartDate />
                  </Collapse>
                </Box>
                <ExecutionInterval />
                <SwapAmount step1State={state.step1} />
                <Submit />
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

/* below is a solution for a checkbox */

// function StartImmediately() {
//   const [field] = useField({ name: 'startImmediately' });

//   console.log(field);

//   const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox({
//     ...field,
//     isChecked: field.value,
//   });

//   console.log(getInputProps);

//   return (
//     <Radio>
//       {/* <chakra.label {...htmlProps} /> */}
//       <input {...getInputProps()} hidden />
//       <CheckboxCard active={state.isChecked}>Yes</CheckboxCard>
//       <CheckboxCard active={!state.isChecked}>No</CheckboxCard>
//     </Radio>
//   );
// }

// function CheckboxCard({ children, active }: ChildrenProp & { active: boolean }) {
//   return (
//     <Box as="label">
//       <Box
//         cursor="pointer"
//         px={2}
//         bg={active ? 'blue.200' : 'inherit'}
//         color={active ? 'navy' : 'inherit'}
//         borderRadius={active ? '2xl' : 'inherit'}
//         _focus={{
//           boxShadow: 'outline',
//         }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// }
