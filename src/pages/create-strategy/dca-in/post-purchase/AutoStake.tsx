import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import RadioCard from '../../../../components/RadioCard';
import Radio from '../../../../components/Radio';
import AutoStakeValues from '../../../../models/AutoStakeValues';

export const autoStakeData: { value: AutoStakeValues; label: string }[] = [
  {
    value: AutoStakeValues.Yes,
    label: 'Yes',
  },
  {
    value: AutoStakeValues.No,
    label: 'No',
  },
];

export function AutoStake() {
  const [field, , helpers] = useField({ name: 'autoStake' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Auto stake KUJI after each swap?</FormLabel>
      <FormHelperText>Tokens will be staked on your behalf, a 14-day lock up period applies.</FormHelperText>
      <HStack>
        <Radio {...getRootProps}>
          {autoStakeData.map((option) => {
            const radio = getRadioProps({ value: option.value });
            return (
              <RadioCard key={option.label} {...radio}>
                {option.label}
              </RadioCard>
            );
          })}
        </Radio>
      </HStack>
    </FormControl>
  );
}
