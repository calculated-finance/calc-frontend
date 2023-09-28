import { FormControl, FormLabel, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { executionIntervalData } from '@helpers/executionIntervalData';
import Radio from './Radio';
import RadioCard from './RadioCard';

export default function ExecutionIntervalLegacy() {
  const [field, , helpers] = useField({ name: 'executionInterval' });
  const [{ value: resultingDenom }] = useField({ name: 'resultingDenom' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    defaultValue: 'daily',
    onChange: helpers.setValue,
  });
  return (
    <FormControl>
      <FormLabel>Every:</FormLabel>
      <Radio {...getRootProps}>
        {executionIntervalData.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <RadioCard textAlign="center" key={option.label} {...radio} isDisabled={!resultingDenom}>
              {option.label}
            </RadioCard>
          );
        })}
      </Radio>
    </FormControl>
  );
}
