import { FormControl, FormHelperText, FormLabel, useRadioGroup, HStack } from '@chakra-ui/react';
import { useField } from 'formik';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';
import TriggerType from '@components/TriggerType';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import YesNoValues from '@models/YesNoValues';

const startImediatelyData: { value: YesNoValues; label: string }[] = [
  {
    value: YesNoValues.Yes,
    label: 'Yes',
  },
  {
    value: YesNoValues.No,
    label: 'No',
  },
];

export default function StartImmediately() {
  const [field, , helpers] = useField({ name: 'startImmediately' });
  const { chain } = useChain();

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
        {chain !== Chains.Osmosis && <TriggerType />}
      </HStack>
    </FormControl>
  );
}
