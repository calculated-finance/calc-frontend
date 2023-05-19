import { FormControl, FormHelperText, FormLabel, useRadioGroup, Flex } from '@chakra-ui/react';
import { useField } from 'formik';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';
import YesNoValues from '@models/YesNoValues';
import { yesNoData } from './PriceThreshold';
import { TransactionType } from './TransactionType';

function getHelperText(applyMultiplier: YesNoValues, transactionType: TransactionType) {
  if (applyMultiplier === YesNoValues.Yes) {
    if (transactionType === TransactionType.Buy) {
      return 'The buy multiplier is applied when the price delta is + or -';
    }
    return 'The sell multiplier is applied when the price delta is + or -';
  }
  if (transactionType === TransactionType.Buy) {
    return 'The buy multiplier is only applied when the price delta < 0%';
  }
  return 'The sell multiplier is only applied when the price delta > 0%';
}

export default function ApplyMultiplier({ transactionType }: { transactionType: TransactionType }) {
  const [field, , helpers] = useField({ name: 'applyMultiplier' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Apply multiplier to both price increases and decreases?</FormLabel>
      <Flex align="center" gap={3}>
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
        <FormHelperText>{getHelperText(field.value, transactionType)}</FormHelperText>
      </Flex>
    </FormControl>
  );
}
