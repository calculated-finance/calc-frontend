import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import SendToWalletValues from '@models/SendToWalletValues';
import getDenomInfo from '@utils/getDenomInfo';
import { FormNames, useDcaOutFormPostPurchase } from '@hooks/useDcaOutForm';
import RadioCard from './RadioCard';
import Radio from './Radio';

// TODO: fix massive hack and actually set default vaule differently (use different schema)
const sendToWalletData: { value: SendToWalletValues; label: string }[] = [
  {
    value: SendToWalletValues.No,
    label: 'Yes',
  },
  {
    value: SendToWalletValues.Yes,
    label: 'No',
  },
];

export default function DcaOutSendToWallet() {
  const [field, , helpers] = useField({ name: 'sendToWallet' });
  const { context } = useDcaOutFormPostPurchase(FormNames.DcaOut);

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Send {getDenomInfo(context?.resultingDenom).name} profits to a different account?</FormLabel>
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
