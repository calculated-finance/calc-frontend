import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { FormNames, useDcaInFormPostPurchase, useFormSchema } from '@hooks/useDcaInForm';
import getDenomInfo from '@utils/getDenomInfo';
import RadioCard from '../../../../components/RadioCard';
import Radio from '../../../../components/Radio';
import SendToWalletValues from '../../../../models/SendToWalletValues';
import { basketOfAssetsSteps } from '@models/DcaInFormData';

const rebalanceModeData: { value: string; label: string }[] = [
  {
    value: 'band-based',
    label: 'Band based',
  },
  {
    value: 'time-based',
    label: 'Time based',
  },
  {
    value: 'none',
    label: 'None',
  },
];

export default function SendToWallet() {
  const [field, , helpers] = useField({ name: 'rebalanceMode' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>How would you like CALC to rebalance for you?</FormLabel>
      <FormHelperText>When your portfolio difference exceeds this band, rebalancing will occur.</FormHelperText>
      <HStack>
        <Radio {...getRootProps}>
          {rebalanceModeData.map((option) => {
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
