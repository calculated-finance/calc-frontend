import { FormControl, FormHelperText, FormLabel, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import Radio from './Radio';
import { StartImmediatelyValues } from './StartImmediatelyValues';
import RadioCard from './RadioCard';

const startImediatelyData: { value: StartImmediatelyValues; label: string }[] = [
  {
    value: StartImmediatelyValues.Yes,
    label: 'Yes',
  },
  {
    value: StartImmediatelyValues.No,
    label: 'No',
  },
];

export default function StartImmediately() {
  const [field, , helpers] = useField({ name: 'startImmediately' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Start Strategy immediately?</FormLabel>
      <FormHelperText>Starting immediately means your first swap occurs straight after set-up.</FormHelperText>
      <Radio {...getRootProps}>
        {startImediatelyData.map((option) => {
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
