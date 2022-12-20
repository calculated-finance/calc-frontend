import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { FormNames, useDcaInFormPostPurchase } from '@hooks/useDcaInForm';
import getDenomInfo from '@utils/getDenomInfo';
import SendToWalletValues from '@models/SendToWalletValues';
import RadioCard from '../../../../components/RadioCard';
import Radio from '../../../../components/Radio';
import AutoStakeValues from '../../../../models/AutoStakeValues';

export const autoStakeData: { value: AutoStakeValues; label: string }[] = [
  {
    value: AutoStakeValues.No,
    label: 'Send to this wallet',
  },
  {
    value: AutoStakeValues.No,
    label: 'Send to another wallet',
  },
  {
    value: AutoStakeValues.Yes,
    label: 'Autostaking',
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
    <FormControl w="full">
      <FormLabel>
        What do you want CALC to do with your {getDenomInfo(context?.resultingDenom).name} after the swap?
      </FormLabel>

      <HStack w="full">
        <Radio {...getRootProps} w="full">
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
      <FormLabel>
        What do you want CALC to do with your {getDenomInfo(context?.resultingDenom).name} after the swap?
      </FormLabel>
      <HStack>
        <Radio {...getRootProps} w="full">
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
