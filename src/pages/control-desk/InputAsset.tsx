import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  SimpleGrid,
  Spacer,
  Text,
  Center,
} from '@chakra-ui/react';
import usePairs, { orderAlphabetically, uniqueBaseDenoms, uniqueQuoteDenoms } from '@hooks/usePairs';
import getDenomInfo, { isDenomStable } from '@utils/getDenomInfo';
import { useField } from 'formik';
import { DenomSelect } from '@components/DenomSelect';

export default function InputAsset() {
  const { data } = usePairs();
  const { pairs } = data || {};
  const [field, meta, helpers] = useField({ name: 'initialDenom' });

  if (!pairs) {
    return null;
  }

  const denoms = orderAlphabetically(
    Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)]))
      .map((denom) => getDenomInfo(denom))
      .filter(isDenomStable),
  );

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Which asset will you deposit?</FormLabel>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">CALC will swap out of this asset for you.</Text>
          <Spacer />
        </Center>
      </FormHelperText>
      <SimpleGrid columns={1} spacing={2}>
        <Box>
          <DenomSelect
            denoms={denoms}
            placeholder="Choose&nbsp;asset"
            value={field.value}
            onChange={helpers.setValue}
            showPromotion
          />
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        </Box>
      </SimpleGrid>
    </FormControl>
  );
}
