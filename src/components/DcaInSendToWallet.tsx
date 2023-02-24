import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { FormNames, useDcaInFormPostPurchase } from '@hooks/useDcaInForm';
import getDenomInfo from '@utils/getDenomInfo';
import RadioCard from '@components/RadioCard';
import Radio from '@components/Radio';
import SendToWalletValues from '@models/SendToWalletValues';

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

export default function DcaInSendToWallet() {
  const [field, , helpers] = useField({ name: 'sendToWallet' });
  const { context } = useDcaInFormPostPurchase(FormNames.DcaIn);

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Send {getDenomInfo(context?.resultingDenom).name} to a different account?</FormLabel>
      <FormHelperText>
        This wallet address will be the one the funds are sent to or autostaked to on your behalf.
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
