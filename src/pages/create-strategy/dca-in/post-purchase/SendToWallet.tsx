import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { FormNames, useDcaInFormPostPurchase } from '@hooks/useDcaInForm';
import getDenomInfo from '@utils/getDenomInfo';
import RadioCard from '../../../../components/RadioCard';
import Radio from '../../../../components/Radio';
import SendToWalletValues from '../../../../models/SendToWalletValues';

const sendToWalletData: { value: SendToWalletValues; label: string }[] = [
  {
    value: SendToWalletValues.Yes,
    label: 'Keep in vault',
  },
  {
    value: SendToWalletValues.No,
    label: 'Generate yield',
  },
];

export default function SendToWallet() {
  const [field, , helpers] = useField({ name: 'sendToWallet' });
  const { context } = useDcaInFormPostPurchase(FormNames.DcaIn);

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>
        What do you want CALC to do with your {getDenomInfo(context?.initialDenom).name} before the swap?
      </FormLabel>

      <HStack>
        <Radio {...getRootProps} w="full">
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
