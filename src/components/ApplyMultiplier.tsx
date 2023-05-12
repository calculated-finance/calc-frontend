import { FormControl, FormHelperText, FormLabel, useRadioGroup, HStack } from '@chakra-ui/react';
import { useField } from 'formik';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';
import { Chains, useChain } from '@hooks/useChain';
import { yesNoData } from './PriceThreshold';

export default function ApplyMultiplier() {
  const [field, , helpers] = useField({ name: 'applyMultiplier' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Apply multiplier to both price increases and decreases?</FormLabel>
      <FormHelperText>CALC will swap less the higher the price goes, and more the lower.</FormHelperText>
      <HStack>
        <Radio {...getRootProps}>
          {yesNoData.map((option) => {
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
