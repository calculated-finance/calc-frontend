import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { FormNames, useDcaOutFormPostPurchase } from '@hooks/useDcaOutForm';
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

export function DummyAutoStakeOut({
  value,
  onChange,
}: {
  value: AutoStakeValues;
  onChange: (value: AutoStakeValues) => void;
}) {
  const { context } = useDcaOutFormPostPurchase(FormNames.DcaOut) || {};

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

export function AutoStakeOut() {
  const [field, , helpers] = useField({ name: 'autoStake' });
  const [sendToWalletField] = useField({ name: 'sendToWallet' });

  const { context } = useDcaOutFormPostPurchase(FormNames.DcaOut);

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
