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
import { useField } from 'formik';
import { AvailableFunds } from '@components/AvailableFunds';
import InitialDeposit from '@components/InitialDeposit';
import { Denom } from '@models/Denom';
import { DenomSelect } from '../DenomSelect';

// its rough to name this quote denom, change to something more generic like "starting denom"
export default function DCAOutInitialDenom({ denoms }: { denoms: Denom[] }) {
  const [field, meta, helpers] = useField({ name: 'initialDenom' });

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
            placeholder="Choose&nbsp;asset"
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
