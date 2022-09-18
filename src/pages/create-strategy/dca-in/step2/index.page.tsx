import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Stack,
  StackProps,
  Text,
  Image,
  Collapse,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  InputRightElement,
} from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { ChildrenProp } from '@components/Sidebar';
import usePageLoad from '@hooks/usePageLoad';
import getDenomInfo from '@utils/getDenomInfo';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { Form, Formik, useField, useFormikContext } from 'formik';
import { useRouter } from 'next/router';
import { FiCalendar } from 'react-icons/fi';
import useDcaInForm from 'src/hooks/useDcaInForm';
import { DcaInFormDataStep2, stepOneValidationSchema } from '../../../../types/DcaInFormData';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Radio({ children, ...props }: ChildrenProp & StackProps) {
  return (
    <HStack bg="abyss" w="min-content" borderRadius="2xl" px={1} py={1} {...props}>
      {children}
    </HStack>
  );
}

function RadioCard(props: UseRadioProps & ChildrenProp) {
  const { children } = props;
  const { getInputProps, getCheckboxProps, htmlProps, getLabelProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" {...htmlProps}>
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        px={2}
        _checked={{
          bg: 'blue.200',
          color: 'navy',
          borderRadius: '2xl',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
      >
        <Text {...getLabelProps()}>{children}</Text>
      </Box>
    </Box>
  );
}

enum ExecutionIntervals {
  Hourly = 'hourly',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

// move to enum?
const executionIntervalData: { value: ExecutionIntervals; label: string }[] = [
  {
    value: ExecutionIntervals.Hourly,
    label: 'Hourly',
  },
  {
    value: ExecutionIntervals.Daily,
    label: 'Daily',
  },
  {
    value: ExecutionIntervals.Weekly,
    label: 'Weekly',
  },
  {
    value: ExecutionIntervals.Monthly,
    label: 'Monthly',
  },
];

enum StartImmediatelyValues {
  Yes = 'yes',
  No = 'no',
}

const startImediatelyData: { value: StartImmediatelyValues; label: string }[] = [
  {
    value: StartImmediatelyValues.Yes,
    label: 'Yes',
  },
  {
    value: StartImmediatelyValues.No,
    label: 'No',
  },
];

function StartImmediately() {
  const [field, , helpers] = useField({ name: 'startImmediately' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value ? StartImmediatelyValues.Yes : StartImmediatelyValues.No,
    onChange: (value: StartImmediatelyValues) => {
      helpers.setValue(value === StartImmediatelyValues.Yes);
    },
  });

  return (
    <FormControl>
      <FormLabel>Start Strategy immediately?</FormLabel>
      <FormHelperText>Starting immediately means your first swap occurs straight after set-up.</FormHelperText>
      <Radio {...getRootProps}>
        {startImediatelyData.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <RadioCard key={option.label} {...radio}>
              {option.label}
            </RadioCard>
          );
        })}
      </Radio>
    </FormControl>
  );
}

function ExecutionInterval() {
  const [field, , helpers] = useField({ name: 'executionInterval' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    onChange: helpers.setValue,
  });
  return (
    <FormControl>
      <FormLabel>How often would you like CALC to purchase for you?</FormLabel>
      <Radio {...getRootProps}>
        {executionIntervalData.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <RadioCard key={option.label} {...radio}>
              {option.label}
            </RadioCard>
          );
        })}
      </Radio>
    </FormControl>
  );
}

function StartDate() {
  const [field, meta, helpers] = useField({ name: 'startDate' });

  const date = field.value ? new Date(field.value) : undefined;

  return (
    <FormControl mt={3}>
      <FormLabel>Strategy start date</FormLabel>
      <FormHelperText>This is when your first swap will be made</FormHelperText>
      <InputGroup>
        <InputLeftElement
          // eslint-disable-next-line react/no-children-prop
          children={
            <HStack direction="row" ml={10}>
              <FiCalendar /> <Text fontSize="sm">Date</Text>
            </HStack>
          }
        />
        <SingleDatepicker
          usePortal
          name={field.name}
          date={date}
          onDateChange={helpers.setValue}
          minDate={new Date()}
          configs={{
            monthNames,
            dayNames,
            dateFormat: 'dd MMM yyyy',
          }}
          propsConfigs={{
            inputProps: {
              placeholder: 'Select a date',
              textAlign: 'right',
            },
          }}
        />
      </InputGroup>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

function SwapAmount() {
  const [field, meta] = useField({ name: 'swapAmount' });
  const { state } = useDcaInForm();

  const { icon, name } = getDenomInfo(state.step1.baseDenom);
  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>How much {name} each purchase?</FormLabel>
      <FormHelperText>
        <Flex>
          <Text>The amount you want swapped each purchase for KUJI.</Text>
          <Spacer />
          <Text>Max:&nbsp;{new Intl.NumberFormat().format(state.step1.initialDeposit || 0) ?? '-'}</Text>
        </Flex>
      </FormHelperText>
      <InputGroup>
        <InputLeftElement>
          <Image src={icon} />
        </InputLeftElement>
        <Input type="number" placeholder="Enter amount" {...field} />
        <InputRightElement textAlign="right" mr={3} textStyle="body-xs">
          <Text>{name}</Text>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}

function Submit() {
  const { isSubmitting, isValid } = useFormikContext<DcaInFormDataStep2>();

  return (
    <FormControl>
      <Button type="submit" w="full" isLoading={isSubmitting} isDisabled={!isValid}>
        Submit
      </Button>
    </FormControl>
  );
}

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
    <Formik initialValues={initialValues} validationSchema={stepOneValidationSchema} onSubmit={onSubmit}>
      {({ values, isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader resetForm={actions.resetAction}>Customise Strategy</NewStrategyModalHeader>
          <NewStrategyModalBody isLoading={isPageLoading && !isSubmitting}>
            <Form>
              <Stack direction="column" spacing={4}>
                <Box>
                  <StartImmediately />
                  <Collapse in={!values.startImmediately}>
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
