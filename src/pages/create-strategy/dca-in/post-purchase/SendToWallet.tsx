import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { useDcaInFormPostPurchase } from '@hooks/useDcaInForm';
import getDenomInfo from '@utils/getDenomInfo';
import RadioCard from '../../../../components/RadioCard';
import Radio from '../../../../components/Radio';
import SendToWalletValues from '../../../../models/SendToWalletValues';

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

export default function SendToWallet() {
  const [field, , helpers] = useField({ name: 'sendToWallet' });
  const { context } = useDcaInFormPostPurchase();

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Send {getDenomInfo(context?.baseDenom).name} from CALC to my wallet after each swap?</FormLabel>
      <FormHelperText>If you don&apos;t tick yes, you will need to claim them from the protocol. </FormHelperText>
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
