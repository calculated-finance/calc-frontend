import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup, Stack } from '@chakra-ui/react';
import { useField } from 'formik';

import YesNoValues from '@models/YesNoValues';
import { DenomInfo } from '@utils/DenomInfo';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';
import { CollapseWithRender } from '@components/CollapseWithRender';
import { DenomPriceInput } from '@components/DenomPriceInput';
import { useControlDeskStrategyInfo } from '../useControlDeskStrategyInfo';

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

function PriceThresholdToggle({ forceOpen = false }: { forceOpen?: boolean }) {
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
              <RadioCard
                key={option.label}
                {...radio}
                isDisabled={forceOpen}
                disabledMessage="We currently do not support the removal of price thresholds, please set a suitably high or low value for your purpose"
              >
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
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  forceOpen?: boolean;
};

export default function PriceThresholdOnceOff({
  initialDenom,
  resultingDenom,
  forceOpen,
}: PriceThresholdProps) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'priceThresholdValue' });
  const [priceThresholdField] = useField({ name: 'priceThresholdEnabled' });

  const { transactionType } = useControlDeskStrategyInfo();

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
        <PriceThresholdToggle forceOpen={forceOpen} />
        <CollapseWithRender isOpen={priceThresholdField.value === YesNoValues.Yes}>
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
