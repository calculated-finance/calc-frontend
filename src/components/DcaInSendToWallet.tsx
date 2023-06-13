import { FormControl, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { DenomInfo } from '@utils/DenomInfo';
import RadioCard from '@components/RadioCard';
import Radio from '@components/Radio';
import YesNoValues from '@models/YesNoValues';

const sendToWalletData: { value: YesNoValues; label: string }[] = [
  {
    value: YesNoValues.Yes,
    label: 'Yes',
  },
  {
    value: YesNoValues.No,
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
