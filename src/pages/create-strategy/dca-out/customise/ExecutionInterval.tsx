import { FormControl, FormLabel, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { ExecutionIntervals } from '../../../../models/ExecutionIntervals';
import Radio from '../../../../components/Radio';
import RadioCard from '../../../../components/RadioCard';

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

export default function ExecutionInterval() {
  const [field, , helpers] = useField({ name: 'executionInterval' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    onChange: helpers.setValue,
  });
  return (
    <FormControl>
      <FormLabel>How often would you like CALC to sell for you?</FormLabel>
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
