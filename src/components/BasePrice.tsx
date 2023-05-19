import { FormControl, FormLabel, HStack, useRadioGroup, Collapse, Box } from '@chakra-ui/react';
import { useStep2Form } from '@hooks/useDcaInForm';
import { useField } from 'formik';

import YesNoValues from '@models/YesNoValues';
import { FormNames } from '@hooks/useFormStore';
import RadioCard from './RadioCard';
import Radio from './Radio';
import { TransactionType } from './TransactionType';
import { DenomPriceInput } from './DenomPriceInput';
import { yesNoData } from './PriceThreshold';

function BasePriceToggle() {
  const [field, , helpers] = useField({ name: 'basePriceIsCurrentPrice' });

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

type BasePriceProps = {
  formName: FormNames;
  transactionType: TransactionType;
};

export default function BasePrice({ formName, transactionType }: BasePriceProps) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'basePriceValue' });
  const { state } = useStep2Form(formName);
  const [priceThresholdField] = useField({ name: 'basePriceIsCurrentPrice' });

  if (!state) {
    return null;
  }

  return (
    <FormControl isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>Set base price to current price?</FormLabel>
      <BasePriceToggle />
      <Collapse in={priceThresholdField.value === YesNoValues.No}>
        <Box m="px" mt={3}>
          <DenomPriceInput
            initialDenom={state.step1.initialDenom}
            resultingDenom={state.step1.resultingDenom}
            transactionType={transactionType}
            error={meta.touched && meta.error}
            onChange={helpers.setValue}
            {...field}
          />
        </Box>
      </Collapse>
    </FormControl>
  );
}
