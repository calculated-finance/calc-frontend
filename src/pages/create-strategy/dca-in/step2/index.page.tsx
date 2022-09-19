import { Box, Stack, Collapse } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import useDcaInForm from 'src/hooks/useDcaInForm';
import { DcaInFormDataStep2, step2ValidationSchema } from '../../../../types/DcaInFormData';
import ExecutionInterval from './ExecutionInterval';
import StartDate from './StartDate';
import StartImmediately from './StartImmediately';
import { StartImmediatelyValues } from './StartImmediatelyValues';
import Submit from './Submit';
import SwapAmount from './SwapAmount';

function DcaInStep2() {
  const router = useRouter();
  const { actions, state } = useDcaInForm();

  const { isPageLoading } = usePageLoad();

  const onSubmit = async (data: DcaInFormDataStep2) => {
    await actions.updateAction({ ...state, step2: data });
    await router.push('/create-strategy/dca-in/confirm-purchase');
  };

  const initialValues = state.step2;

  if (!state.step1.initialDeposit || !state.step1.baseDenom) {
    return null;
  }

  return (
    <Formik initialValues={initialValues} validationSchema={step2ValidationSchema} onSubmit={onSubmit}>
      {({ values, isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader resetForm={actions.resetAction}>Customise Strategy</NewStrategyModalHeader>
          <NewStrategyModalBody isLoading={isPageLoading && !isSubmitting}>
            <Form>
              <Stack direction="column" spacing={4}>
                <Box>
                  <StartImmediately />
                  <Collapse in={values.startImmediately === StartImmediatelyValues.No}>
                    <StartDate />
                  </Collapse>
                </Box>
                <ExecutionInterval />
                <SwapAmount />
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
