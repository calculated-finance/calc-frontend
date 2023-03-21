import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Text } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import { useField, useFormikContext } from 'formik';
import { Denom } from '@models/Denom';
import { DenomSelect } from './DenomSelect';

export default function DCAInResultingDenom({ denoms }: { denoms: Denom[] }) {
  const [field, meta, helpers] = useField({ name: 'resultingDenom' });

  const {
    values: { initialDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <FormLabel>What asset do you want to invest in?</FormLabel>
      <FormHelperText>
        <Text textStyle="body-xs">CALC will purchase this asset for you</Text>
      </FormHelperText>
      <DenomSelect
        denoms={denoms}
        placeholder="Choose asset"
        value={field.value}
        onChange={helpers.setValue}
        optionLabel="Swapped on FIN"
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
