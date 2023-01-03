import { FormControl, FormHelperText, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { FormNames, useDcaInFormPostPurchase } from '@hooks/useDcaInForm';
import getDenomInfo from '@utils/getDenomInfo';
import RadioCard from '../../../../components/RadioCard';
import Radio from '../../../../components/Radio';
import SendToWalletValues from '../../../../models/SendToWalletValues';
import { yesNoData } from '../customise/yesNoData';

export default function BasketManager() {
  const [field, , helpers] = useField({ name: 'basketManager' });
  const { context } = useDcaInFormPostPurchase(FormNames.DcaIn);

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Add a basket manager?</FormLabel>
      <FormHelperText>This wallet will be able to make changes to the basket of assets.</FormHelperText>
      <HStack>
        <Radio {...getRootProps}>
          {yesNoData.map((option) => {
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
