import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { useDcaInFormPostPurchase } from '@hooks/useDcaInForm';
import getDenomInfo from '@utils/getDenomInfo';
import AutoStakeValues from '@models/AutoStakeValues';
import { FormNames } from '@hooks/useFormStore';
import RadioCard from './RadioCard';
import Radio from './Radio';

const autoStakeData: { value: AutoStakeValues; label: string }[] = [
  {
    value: AutoStakeValues.Yes,
    label: 'Yes',
  },
  {
    value: AutoStakeValues.No,
    label: 'No',
  },
];

export function DummyAutoStake({
  value,
  onChange,
  formName,
}: {
  value: AutoStakeValues;
  onChange: (value: AutoStakeValues) => void;
  formName: FormNames;
}) {
  const { context } = useDcaInFormPostPurchase(formName) || {};

  const { getRootProps, getRadioProps } = useRadioGroup({
    value,
    onChange,
  });

  return (
    <FormControl>
      <FormLabel>Auto stake {getDenomInfo(context?.resultingDenom).name} after each swap?</FormLabel>
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

export function AutoStake({ formName }: { formName: FormNames }) {
  const [field, , helpers] = useField({ name: 'autoStake' });

  const { context } = useDcaInFormPostPurchase(formName);

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Auto stake {getDenomInfo(context?.resultingDenom).name} after each swap?</FormLabel>
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
