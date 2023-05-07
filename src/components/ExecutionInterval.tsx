import {
  FormControl,
  FormLabel,
  Text,
  SimpleGrid,
  Spacer,
  useRadioGroup,
  Flex,
  Stack,
  HStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { executionIntervalData } from '@helpers/executionIntervalData';
import { Chains, useChain } from '@hooks/useChain';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { featureFlags } from 'src/constants';
import Radio from './Radio';
import RadioCard from './RadioCard';
import NumberInput from './NumberInput';
import Select from './Select';

function ExecutionIntervalLegacy() {
  const [field, , helpers] = useField({ name: 'executionInterval' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    onChange: helpers.setValue,
  });
  return (
    <FormControl>
      {featureFlags.extraTimeOptions ? (
        <FormLabel>I would like CALC to swap for me every:</FormLabel>
      ) : (
        <FormLabel>How often would you like CALC to swap for you?</FormLabel>
      )}
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
function TimePeriodOption({ label, icon }: { label: string; icon: any }) {
  return (
    <HStack flexGrow={1}>
      {icon}
      <Text>{label}</Text>
    </HStack>
  );
}
const timePeriodOptions = [
  { value: 'minute', label: <TimePeriodOption label="Minute(s)" icon={<FiClock />} /> },
  { value: 'hour', label: <TimePeriodOption label="Hour(s)" icon={<FiClock />} /> },
  { value: 'day', label: <TimePeriodOption label="Day(s)" icon={<FiCalendar />} /> },
  { value: 'week', label: <TimePeriodOption label="Week(s)" icon={<FiCalendar />} /> },
];

function ExecutionIntervalCustom() {
  const [{ onChange, ...incrementField }, incrementMeta, incrementHelpers] = useField({
    name: 'executionIntervalIncrement',
  });
  const [periodField, periodMeta, periodHelpers] = useField({ name: 'executionIntervalPeriod' });

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

export default function ExecutionInterval() {
  const { chain } = useChain();
  if (chain === Chains.Osmosis) {
    return <ExecutionIntervalCustom />;
  }
  return <ExecutionIntervalLegacy />;
}
