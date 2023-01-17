import { FormControl, FormLabel, Stack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import Radio from '../../../../components/Radio';
import RadioCard from '../../../../components/RadioCard';
import { executionIntervalData } from '../../../../helpers/executionIntervalData';

export default function ExecutionInterval() {
  const [field, , helpers] = useField({ name: 'executionInterval' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    onChange: helpers.setValue,
  });
  return (
    <FormControl>
      <FormLabel>I would like CALC to purchase for me every:</FormLabel>
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
