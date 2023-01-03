import { FormControl, FormLabel, HStack, useRadioGroup } from '@chakra-ui/react';
import { useField } from 'formik';
import { FormNames, useFormSchema } from '@hooks/useDcaInForm';
import { basketOfAssetsSteps } from '@models/DcaInFormData';
import RadioCard from '../../../../components/RadioCard';
import Radio from '../../../../components/Radio';
import AutoStakeValues from '../../../../models/AutoStakeValues';

export const autoStakeData: { value: AutoStakeValues; label: string }[] = [
  {
    value: AutoStakeValues.Yes,
    label: 'Yes',
  },
  {
    value: AutoStakeValues.No,
    label: 'No',
  },
];

export function CopierCharge() {
  const [field, , helpers] = useField({ name: 'copierCharge' });

  const {
    state: [state],
  } = useFormSchema(FormNames.BasketOfAssets, basketOfAssetsSteps, 3);

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Charge fees for copiers of this basket?</FormLabel>
      <HStack>
        <Radio {...getRootProps}>
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
