import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup, Stack, Text } from '@chakra-ui/react';
import { useField } from 'formik';
import YesNoValues from '@models/YesNoValues';
import { DenomInfo } from '@utils/DenomInfo';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';
import { CollapseWithRender } from '@components/CollapseWithRender';
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

function CalcCalculateSwapsToggle({ forceOpen = false }: { forceOpen?: boolean }) {
  const [field, , helpers] = useField({ name: 'calcCalculateSwapsEnabled' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    defaultValue: YesNoValues.Yes,
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

export default function CalcCalculateSwaps({
  initialDenom,
  resultingDenom,
  forceOpen,
}: PriceThresholdProps) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'calcCalculateSwaps' });
  const [calcCalculateSwapsField] = useField({ name: 'calcCalculateSwapsEnabled' });

  const { transactionType } = useControlDeskStrategyInfo();

  const title = 'Let CALC calculate the optimal swap amount and frequency?';

  const description = 'This will be optimised to reduce price impact.'

  return (
    <FormControl isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>{title}</FormLabel>
      <FormHelperText>{description}</FormHelperText>
      <Stack spacing={3}>
        <CalcCalculateSwapsToggle forceOpen={forceOpen} />
        <CollapseWithRender isOpen={calcCalculateSwapsField.value === YesNoValues.No}>
          {/* <DenomPriceInput
            initialDenom={initialDenom}
            resultingDenom={resultingDenom}
            transactionType={transactionType}
            error={meta.touched && meta.error}
            onChange={helpers.setValue}
            {...field}
          /> */}
          <Text>Add feature</Text>
        </CollapseWithRender>
      </Stack>
    </FormControl>
  );
}
