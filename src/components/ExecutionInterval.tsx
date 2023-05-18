import { FormControl, FormLabel, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { featureFlags } from 'src/constants';
import { executionIntervalData } from '@helpers/executionIntervalData';
import Radio from './Radio';
import RadioCard from './RadioCard';

export default function ExecutionInterval() {
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
