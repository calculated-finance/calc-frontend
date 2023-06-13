import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import YesNoValues from '@models/YesNoValues';
import RadioCard from './RadioCard';
import Radio from './Radio';

// TODO: fix massive hack and actually set default vaule differently (use different schema)
const sendToWalletData: { value: YesNoValues; label: string }[] = [
  {
    value: YesNoValues.No,
    label: 'Yes',
  },
  {
    value: YesNoValues.Yes,
    label: 'No',
  },
];

export default function DcaOutSendToWallet() {
  const [field, , helpers] = useField({ name: 'sendToWallet' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Send the profits to a different account?</FormLabel>
      <FormHelperText>
        Cashflow is king, this tool is perfect for paying your team or maintaining cashflow for regular expenses.
      </FormHelperText>
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
