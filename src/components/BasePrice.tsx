import { FormControl, FormLabel, HStack, useRadioGroup, Stack } from '@chakra-ui/react';
import { useField } from 'formik';

import YesNoValues from '@models/YesNoValues';
import { DenomInfo } from '@utils/DenomInfo';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import RadioCard from './RadioCard';
import Radio from './Radio';
import { TransactionType } from './TransactionType';
import { DenomPriceInput } from './DenomPriceInput';
import { yesNoData } from './PriceThreshold';
import { CollapseWithRender } from './CollapseWithRender';

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
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
};

export default function BasePrice({ initialDenom, resultingDenom }: BasePriceProps) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'basePriceValue' });
  const [priceThresholdField] = useField({ name: 'basePriceIsCurrentPrice' });

  const { transactionType } = useStrategyInfo();

  return (
    <FormControl isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>Set base price to current price?</FormLabel>
      <Stack spacing={3}>
        <BasePriceToggle />
        <CollapseWithRender isOpen={priceThresholdField.value === YesNoValues.No}>
          <DenomPriceInput
            initialDenom={initialDenom}
            resultingDenom={resultingDenom}
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
