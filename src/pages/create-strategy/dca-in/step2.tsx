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
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spacer,
  Stack,
  Text,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';
import Icon from '@components/Icon';
import { getFlowLayout } from '@components/Layout';
import { ArrowLeftIcon } from '@fusion-icons/react/interface';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { useStateMachine } from 'little-state-machine';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import { Controller, useController, useForm } from 'react-hook-form';
import { NextPageWithLayout } from 'src/pages/_app';
import updateAction from 'src/updateAction';

function RadioCard(props: any) {
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

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
const Example = forwardRef(({ control, name, defaultValue, ...props }: any, ref) => {
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

// eslint-disable-next-line react/function-component-definition
const DcaIn: NextPageWithLayout = () => {
  const router = useRouter();
  const { actions, state } = useStateMachine({ updateAction });

  const onSubmit = (data: any) => {
    actions.updateAction(data);
    router.push('/create-strategy/dca-in/confirmation');
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: state,
  });

  return (
    <Modal isOpen onClose={() => {}}>
      {/* <ModalOverlay /> */}
      <ModalContent>
        <ModalHeader textAlign="center">
          <Flex>
            <Link passHref href="/create-strategy/dca-in">
              <Icon cursor="pointer" as={ArrowLeftIcon} />
            </Link>
            <Spacer />
            <Text>DCA in</Text>
            <Spacer />
            <Button>Cancel</Button>
          </Flex>
        </ModalHeader>
        <ModalBody p={4}>
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
                <FormLabel>How much {state.baseDenom} each purchase?</FormLabel>
                <FormHelperText>
                  <Flex>
                    <Text>The amount you want swapped each purchase for KUJI.</Text>
                    <Spacer />
                    Max: {new Intl.NumberFormat().format(state.initialDeposit) ?? '-'}
                  </Flex>
                </FormHelperText>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  {...register('swapAmount', {
                    required: true,
                    min: { value: 1, message: 'Must be more than 0.' },
                    max: { value: state.initialDeposit, message: 'Must be less than initial deposit.' },
                  })}
                />
                <FormErrorMessage>{errors.swapAmount && errors.swapAmount?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <Button type="submit" w="full">
                  Submit
                </Button>
              </FormControl>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

DcaIn.getLayout = getFlowLayout;

export default DcaIn;
