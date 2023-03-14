import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { FormNames, useDcaInFormPostPurchase } from '@hooks/useDcaInForm';
import getDenomInfo from '@utils/getDenomInfo';
import SendToWalletValues from '@models/SendToWalletValues';
import AutoStakeValues from '@models/AutoStakeValues';
import RadioCard from './RadioCard';
import Radio from './Radio';

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

export function DummyAutoStake({
  value,
  onChange,
}: {
  value: AutoStakeValues;
  onChange: (value: AutoStakeValues) => void;
}) {
  const { context } = useDcaInFormPostPurchase(FormNames.DcaIn) || {};

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

export function AutoStake() {
  const [field, , helpers] = useField({ name: 'autoStake' });
  const [sendToWalletField] = useField({ name: 'sendToWallet' });

  const { context } = useDcaInFormPostPurchase(FormNames.DcaIn);

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl isDisabled={sendToWalletField.value === SendToWalletValues.No}>
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
