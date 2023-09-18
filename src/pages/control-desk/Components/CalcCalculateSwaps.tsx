import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup, Stack } from '@chakra-ui/react';
import { useField } from 'formik';
import YesNoValues from '@models/YesNoValues';
import { DenomInfo } from '@utils/DenomInfo';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';
import { CollapseWithRender } from '@components/CollapseWithRender';
import { TransactionType } from '@components/TransactionType';
import ExecutionInterval from '@components/ExecutionInterval';
import SwapAmount from '@components/SwapAmount';

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
              <RadioCard key={option.label} {...radio} isDisabled={forceOpen}>
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
  transactionType: TransactionType;
};

export default function CalcCalculateSwaps({
  initialDenom,
  resultingDenom,
  forceOpen,
  transactionType,
}: PriceThresholdProps) {
  const [, meta] = useField({ name: 'calcCalculateSwaps' });
  const [{ value: totalCollateralisedDeposit }, ,] = useField({ name: 'totalCollateralisedAmount' });
  const [{ value: calcCalculateSwapsEnabled }, ,] = useField({ name: 'calcCalculateSwapsEnabled' });

  const title = 'Let CALC calculate the optimal swap amount and frequency?';

  const description = 'This will be optimised to reduce price impact.';

  return (
    <FormControl isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>{title}</FormLabel>
      <FormHelperText>{description}</FormHelperText>
      <Stack spacing={3}>
        <CalcCalculateSwapsToggle forceOpen={forceOpen} />
        <CollapseWithRender isOpen={calcCalculateSwapsEnabled === YesNoValues.No}>
          <Stack spacing={3}>
            <ExecutionInterval />
            <SwapAmount
              isEdit
              initialDenom={initialDenom}
              resultingDenom={resultingDenom}
              initialDeposit={totalCollateralisedDeposit}
              transactionType={transactionType}
            />
          </Stack>
        </CollapseWithRender>
      </Stack>
    </FormControl>
  );
}
