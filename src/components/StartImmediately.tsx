import { FormControl, FormHelperText, FormLabel, useRadioGroup, HStack } from '@chakra-ui/react';
import { useField } from 'formik';
import Radio from '@components/Radio';
import { StartImmediatelyValues } from '@models/StartImmediatelyValues';
import RadioCard from '@components/RadioCard';
import TriggerType from '@components/TriggerType';

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
      <FormLabel>Start strategy immediately?</FormLabel>
      <FormHelperText>Starting immediately means your first swap occurs straight after set-up.</FormHelperText>
      <HStack>
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
        <TriggerType />
      </HStack>
    </FormControl>
  );
}
