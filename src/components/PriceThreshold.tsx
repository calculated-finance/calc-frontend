import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup, Stack } from '@chakra-ui/react';
import { useStep2Form } from '@hooks/useDcaInForm';
import { useField } from 'formik';

import YesNoValues from '@models/YesNoValues';
import { FormNames } from '@hooks/useFormStore';
import RadioCard from './RadioCard';
import Radio from './Radio';
import { TransactionType } from './TransactionType';
import { DenomPriceInput } from './DenomPriceInput';
import { CollapseWithRender } from './CollapseWithRender';

export const yesNoData: { value: YesNoValues; label: string }[] = [
  {
    value: YesNoValues.Yes,
    label: 'Yes',
  },
  {
    value: YesNoValues.No,
    label: 'No',
  },
];

function PriceThresholdToggle() {
  const [field, , helpers] = useField({ name: 'priceThresholdEnabled' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
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

type PriceThresholdProps = {
  formName: FormNames;
  transactionType: TransactionType;
};

export default function PriceThreshold({ formName, transactionType }: PriceThresholdProps) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'priceThresholdValue' });
  const { state } = useStep2Form(formName);
  const [priceThresholdField] = useField({ name: 'priceThresholdEnabled' });

  if (!state) {
    return null;
  }

  const title = transactionType === 'buy' ? 'Set buy price ceiling?' : 'Set sell price floor?';

  const description =
    transactionType === 'buy'
      ? "CALC won't buy if the asset price exceeds this set value."
      : "CALC won't sell if the asset price drops below this set value.";

  return (
    <FormControl isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>{title}</FormLabel>
      <FormHelperText>{description}</FormHelperText>
      <Stack spacing={3}>
        <PriceThresholdToggle />
        <CollapseWithRender isOpen={priceThresholdField.value === YesNoValues.Yes}>
          <DenomPriceInput
            initialDenom={state.step1.initialDenom}
            resultingDenom={state.step1.resultingDenom}
            transactionType={transactionType}
            error={meta.touched && meta.error}
            onChange={helpers.setValue}
            {...field}
          />
        </CollapseWithRender>
      </Stack>
    </FormControl>
  );
}
