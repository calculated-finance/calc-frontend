import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  SimpleGrid,
  Spacer,
  Text,
  HStack,
  Center,
} from '@chakra-ui/react';
import usePairs, { uniqueQuoteDenoms } from '@hooks/usePairs';
import { Denom } from '@models/Denom';
import getDenomInfo, { isDenomStable } from '@utils/getDenomInfo';
import { useField } from 'formik';
import DenomIcon from '@components/DenomIcon';
import { AvailableFunds } from '@components/AvailableFunds';
import { DenomSelect } from '@components/DenomSelect';
import InitialDeposit from '@components/InitialDeposit';

export default function DCAInInitialDenom() {
  const { data } = usePairs();
  const { pairs } = data || {};
  const [field, meta, helpers] = useField({ name: 'initialDenom' });

  if (!pairs) {
    return null;
  }

  const denoms = uniqueQuoteDenoms(pairs).filter(isDenomStable);

  const { promotion } = getDenomInfo(field.value);

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>How will you fund your first investment?</FormLabel>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">Choose between stablecoins or fiat</Text>
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
            showPromotion
          />
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
          {promotion && <FormHelperText color="blue.200">{promotion}</FormHelperText>}
        </Box>
        <InitialDeposit />
      </SimpleGrid>
    </FormControl>
  );
}
