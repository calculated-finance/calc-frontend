import { Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Text } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import usePairs, { uniqueBaseDenomsFromQuoteDenom, uniqueQuoteDenomsFromBaseDenom } from '@hooks/usePairs';
import { useField, useFormikContext } from 'formik';
import { chakraComponents, OptionProps } from 'chakra-react-select';
import Select from '../../../components/Select';
import { DenomSelectLabel } from './QuoteDenom';

export default function BaseDenom() {
  const [field, meta, helpers] = useField({ name: 'baseDenom' });
  const { data } = usePairs();
  const { pairs } = data || {};

  const {
    values: { quoteDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  const [quoteDenomField] = useField({ name: 'quoteDenom' });

  const filteredPairsOptions = uniqueQuoteDenomsFromBaseDenom(quoteDenomField.value, pairs).map(
    (denom) =>
      ({
        value: denom,
        label: <DenomSelectLabel denom={denom} />,
      } || []),
  );

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!quoteDenom}>
      <FormLabel>How do you want to hold your profits?</FormLabel>
      <FormHelperText>
        <Text textStyle="body-xs">Each asset comes with it’s own risk</Text>
      </FormHelperText>
      <Select
        options={filteredPairsOptions}
        placeholder="Choose asset"
        value={field.value}
        onChange={helpers.setValue}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
