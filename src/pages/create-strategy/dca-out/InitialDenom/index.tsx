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
import usePairs, { uniqueBaseDenoms, uniqueQuoteDenoms } from '@hooks/usePairs';
import { useField } from 'formik';
import { isDenomVolatile } from '@utils/getDenomInfo';
import { AvailableFunds } from '@components/AvailableFunds';
import InitialDeposit from '@components/InitialDeposit';
import { DenomSelect } from '../../../../components/DenomSelect';

// its rough to name this quote denom, change to something more generic like "starting denom"
export default function InitialDenom() {
  const { data } = usePairs();
  const { pairs } = data || {};
  const [field, meta, helpers] = useField({ name: 'initialDenom' });

  const denoms = Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)])).filter(isDenomVolatile);

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>What position do you want to take profit on? </FormLabel>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">CALC currently supports pairs trading on FIN.</Text>
          <Spacer />
          <AvailableFunds />
        </Center>
      </FormHelperText>
      <SimpleGrid columns={2} spacing={2}>
        <Box>
          <DenomSelect
            denoms={denoms}
            placeholder="Choose asset"
            value={field.value}
            onChange={helpers.setValue}
            optionLabel="FIN"
          />
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        </Box>
        <InitialDeposit />
      </SimpleGrid>
    </FormControl>
  );
}
