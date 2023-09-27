import { FormControl, FormLabel, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { executionIntervalData } from '@helpers/executionIntervalData';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';

export default function ExecutionIntervalLegacy() {
  const [field, , helpers] = useField({ name: 'executionInterval' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    defaultValue: 'daily',
    onChange: helpers.setValue,
  });
  return (
    <FormControl>
      <FormLabel>I would like CALC to swap for me every:</FormLabel>
      <Radio w="100%" {...getRootProps}>
        {executionIntervalData.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <RadioCard textAlign="center" w="full" key={option.label} {...radio}>
              {option.label}
            </RadioCard>
          );
        })}
      </Radio>
    </FormControl>
  );
}
