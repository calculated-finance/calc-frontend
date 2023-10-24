import {
  FormControl,
  FormLabel,
  Text,
  SimpleGrid,
  Spacer,
  Flex,
  Stack,
  HStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { IconType } from 'react-icons/lib';
import { ReactElement } from 'react';
import NumberInput from './NumberInput';
import Select from './Select';

function TimePeriodOption({ label, icon }: { label: string; icon: ReactElement<IconType> }) {
  return (
    <HStack flexGrow={1}>
      {icon}
      <Text>{label}</Text>
    </HStack>
  );
}

const timePeriodOptions = [
  { value: 'minute', label: <TimePeriodOption label="Minute(s)" icon={<FiClock />} /> },
  { value: 'hourly', label: <TimePeriodOption label="Hour(s)" icon={<FiClock />} /> },
  { value: 'daily', label: <TimePeriodOption label="Day(s)" icon={<FiCalendar />} /> },
  { value: 'weekly', label: <TimePeriodOption label="Week(s)" icon={<FiCalendar />} /> },
];

export default function ExecutionInterval() {
  const [{ onChange, ...incrementField }, incrementMeta, incrementHelpers] = useField({
    name: 'executionIntervalIncrement',
  });
  const [periodField, periodMeta, periodHelpers] = useField({ name: 'executionInterval' });

  return (
    <FormControl>
      <FormLabel>CALC will swap for you, every:</FormLabel>
      <Stack>
        <Flex>
          <Text textStyle="body-xs">Increment</Text>
          <Spacer />
          <Text textStyle="body-xs">Time period</Text>
        </Flex>
        <SimpleGrid columns={2} spacing={2}>
          <FormControl isInvalid={incrementMeta.touched && !!incrementMeta.error}>
            <NumberInput
              data-testid="execution-interval-increment"
              onChange={incrementHelpers.setValue}
              placeholder="Enter increment"
              {...incrementField}
              decimalScale={0}
            />
            <FormErrorMessage>{incrementMeta.touched && incrementMeta.error}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={periodMeta.touched && !!periodMeta.error}>
            <Select
              value={periodField.value}
              options={timePeriodOptions}
              placeholder="Select period"
              onChange={periodHelpers.setValue}
            />
            <FormErrorMessage>{periodMeta.touched && periodMeta.error}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      </Stack>
    </FormControl>
  );
}
