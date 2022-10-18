import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Text } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import usePairs, { uniqueQuoteDenomsFromBaseDenom } from '@hooks/usePairs';
import { useField, useFormikContext } from 'formik';
import { DenomSelect } from '../../../components/DenomSelect';

export default function ResultingDenom() {
  const [field, meta, helpers] = useField({ name: 'resultingDenom' });
  const { data } = usePairs();
  const { pairs } = data || {};

  const {
    values: { initialDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  const [initialDenomField] = useField({ name: 'initialDenom' });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <FormLabel>How do you want to hold your profits?</FormLabel>
      <FormHelperText>
        <Text textStyle="body-xs">Each asset comes with it&apos;s own risk</Text>
      </FormHelperText>
      <DenomSelect
        denoms={uniqueQuoteDenomsFromBaseDenom(initialDenomField.value, pairs)}
        placeholder="Choose asset"
        value={field.value}
        onChange={helpers.setValue}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
