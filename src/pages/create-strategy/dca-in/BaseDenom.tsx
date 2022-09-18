import { Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Text } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/types/DcaInFormData';
import usePairs, { uniqueBaseDenomsFromQuoteDenom } from '@hooks/usePairs';
import { useField, useFormikContext } from 'formik';
import { chakraComponents, OptionProps } from 'chakra-react-select';
import getDenomInfo from '@utils/getDenomInfo';
import Select from './Select';
import { DenomSelectLabel } from './QuoteDenom';

const customComponents = {
  Option: ({ children, ...props }: OptionProps) => (
    <chakraComponents.Option {...props}>
      {children}
      <Flex flexShrink={0}>
        <Text fontSize="xs">Swapped on FIN</Text>
      </Flex>
    </chakraComponents.Option>
  ),
};

export default function BaseDenom() {
  const [field, meta, helpers] = useField({ name: 'baseDenom' });
  const { data } = usePairs();
  const { pairs } = data || {};

  const {
    values: { quoteDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  const [quoteDenomField] = useField({ name: 'quoteDenom' });

  const filteredPairsOptions = uniqueBaseDenomsFromQuoteDenom(quoteDenomField.value, pairs).map(
    (denom) =>
      ({
        value: denom,
        label: <DenomSelectLabel denom={denom} />,
      } || []),
  );

  return (
    <FormControl isInvalid={Boolean(meta.error)} isDisabled={!quoteDenom}>
      <FormLabel>What asset do you want to invest in?</FormLabel>
      <FormHelperText>
        <Text textStyle="body-xs">CALC will purchase this asset for you</Text>
      </FormHelperText>
      <Select
        options={filteredPairsOptions}
        placeholder="Choose asset"
        value={field.value}
        onChange={helpers.setValue}
        customComponents={customComponents}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
