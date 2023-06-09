import { FormControl, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { DenomInfo } from '@utils/DenomInfo';
import RadioCard from '@components/RadioCard';
import Radio from '@components/Radio';
import SendToWalletValues from '@models/SendToWalletValues';

const sendToWalletData: { value: SendToWalletValues; label: string }[] = [
  {
    value: SendToWalletValues.Yes,
    label: 'Yes',
  },
  {
    value: SendToWalletValues.No,
    label: 'No',
  },
];

export default function DcaInSendToWallet({ resultingDenom }: { resultingDenom: DenomInfo }) {
  const [field, , helpers] = useField({ name: 'sendToWallet' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Send {resultingDenom.name} to my wallet?</FormLabel>
      <HStack>
        <Radio {...getRootProps}>
          {sendToWalletData.map((option) => {
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
