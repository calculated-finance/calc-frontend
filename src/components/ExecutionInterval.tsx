import { FormControl, FormLabel, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { featureFlags } from 'src/constants';
import Radio from './Radio';
import RadioCard from './RadioCard';
import { executionIntervalData } from '../helpers/executionIntervalData';

export default function ExecutionInterval() {
  const [field, , helpers] = useField({ name: 'executionInterval' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    onChange: helpers.setValue,
  });
  return (
    <FormControl>
      {featureFlags.extraTimeOptions ? (
        <FormLabel>I would like CALC to purchase for me every:</FormLabel>
      ) : (
        <FormLabel>How often would you like CALC to purchase for you?</FormLabel>
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
