import { Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Text } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import usePairs, { uniqueBaseDenomsFromQuoteDenom } from '@hooks/usePairs';
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
      <FormLabel>What asset do you want to invest in?</FormLabel>
      <FormHelperText>
        <Text textStyle="body-xs">CALC will purchase this asset for you</Text>
      </FormHelperText>
      <DenomSelect
        denoms={uniqueBaseDenomsFromQuoteDenom(initialDenomField.value, pairs)}
        placeholder="Choose asset"
        value={field.value}
        onChange={helpers.setValue}
        optionLabel="Swapped on FIN"
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
