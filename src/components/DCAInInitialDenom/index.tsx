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
import { AvailableFunds } from '@components/AvailableFunds';
import { DenomSelect } from '@components/DenomSelect';
import InitialDeposit from '@components/InitialDeposit';

export default function DCAInInitialDenom() {
  const { pairs } = usePairs();
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
      <FormLabel>How will you fund your first investment?</FormLabel>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">Choose stablecoin</Text>
          <Spacer />
          {field.value && <AvailableFunds denom={getDenomInfo(field.value)} />}
        </Center>
      </FormHelperText>
      <SimpleGrid columns={2} spacing={2}>
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
        <InitialDeposit />
      </SimpleGrid>
    </FormControl>
  );
}
