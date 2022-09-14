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
  Spacer,
  Stack,
  Text,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { ChildrenProp } from '@components/Sidebar';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import { Controller, FieldValues, useController, useForm } from 'react-hook-form';
import useDcaInForm from 'src/hooks/useDcaInForm';

function RadioCard(props: UseRadioProps & ChildrenProp) {
  const { children } = props;
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
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
        {children}
      </Box>
    </Box>
  );
}

const Example = forwardRef(({ control, name, defaultValue }: FieldValues) => {
  const { field } = useController({
    name,
    control,
    rules: { required: 'Toggle is required' },
    defaultValue,
  });

  const options = [
    {
      value: 'hourly',
      label: 'Hourly',
    },
    {
      value: 'daily',
      label: 'Daily',
    },
    {
      value: 'weekly',
      label: 'Weekly',
    },
    {
      value: 'monthly',
      label: 'Monthly',
    },
  ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
  });

  return (
    <HStack {...getRootProps} bg="abyss" borderRadius="2xl" px={2} py={1}>
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value });
        return (
          <RadioCard key={option.value} {...radio}>
            {option.label}
          </RadioCard>
        );
      })}
    </HStack>
  );
});

type Step2FormData = {
  executionInterval?: string;
  startDate?: Date;
  swapAmount?: number;
};

function DcaInStep2() {
  const router = useRouter();
  const { actions, state } = useDcaInForm();

  const onSubmit = async (data: Step2FormData) => {
    await actions.updateAction({ ...state, step2: data });
    await router.push('/create-strategy/dca-in/confirm-purchase');
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Step2FormData>({
    defaultValues: state.step2,
  });

  if (!state.step1.initialDeposit || !state.step1.baseDenom) {
    return null;
  }

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader resetForm={actions.resetAction}>Customise Strategy</NewStrategyModalHeader>
      <NewStrategyModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={4}>
            <FormControl>
              <FormLabel>Strategy start date</FormLabel>
              {/* todo: validate that date is in the future */}
              <Controller
                control={control}
                name="startDate"
                render={({ field: { onChange, value, name } }) => (
                  <SingleDatepicker name={name} date={value ? new Date(value) : undefined} onDateChange={onChange} />
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel>How often would you like CALC to purchase for you?</FormLabel>
              <Example name="executionInterval" defaultValue="daily" control={control} />
            </FormControl>

            <FormControl isInvalid={Boolean(errors.swapAmount)}>
              <FormLabel>How much {state.step1.baseDenom} each purchase?</FormLabel>
              <FormHelperText>
                <Flex>
                  <Text>The amount you want swapped each purchase for KUJI.</Text>
                  <Spacer />
                  Max: {new Intl.NumberFormat().format(state.step1.initialDeposit) ?? '-'}
                </Flex>
              </FormHelperText>
              <Input
                type="number"
                placeholder="Enter amount"
                {...register('swapAmount', {
                  required: true,
                  min: { value: 1, message: 'Must be more than 0.' },
                  max: { value: state.step1.initialDeposit, message: 'Must be less than initial deposit.' },
                })}
              />
              <FormErrorMessage>{errors.swapAmount && errors.swapAmount?.message}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <Button type="submit" w="full" isLoading={isSubmitting}>
                Submit
              </Button>
            </FormControl>
          </Stack>
        </form>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}

DcaInStep2.getLayout = getFlowLayout;

export default DcaInStep2;
