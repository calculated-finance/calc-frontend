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
import getDenomInfo, { isDenomStable, isDenomVolatile } from '@utils/getDenomInfo';
import { useField } from 'formik';
import DenomIcon from '@components/DenomIcon';
import { AvailableFunds } from '@components/AvailableFunds';
import { DenomSelect } from '@components/DenomSelect';
import InitialDeposit from '../InitialDeposit';
import NumberInput from '@components/NumberInput';
import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';

export function DenomSelectLabel({ denom }: { denom: Denom }) {
  return (
    <HStack spacing={2} w="full">
      <DenomIcon denomName={denom} />
      <Text>{getDenomInfo(denom).name}</Text>
    </HStack>
  );
}

export default function PortfolioDenoms() {
  const { data } = usePairs();
  const { pairs } = data || {};
  const [field, meta, helpers] = useField({ name: 'portfolioDenoms' });

  console.log(field.value);

  if (!pairs) {
    return null;
  }

  const denoms = SUPPORTED_DENOMS.filter(isDenomVolatile);

  const { promotion } = getDenomInfo(field.value);

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Define your portfolio</FormLabel>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">Asset</Text>
          <Spacer />
          <Text textStyle="body-xs">Percentage</Text>
        </Center>
      </FormHelperText>
      {field?.value?.map((denom: any) => (
        <SimpleGrid columns={2} spacing={2}>
          <Box>
            <DenomSelect
              denoms={denoms}
              placeholder="Choose asset"
              value={denom.denom}
              onChange={() => {}}
              showPromotion
            />
            <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
            {promotion && <FormHelperText color="blue.200">{promotion}</FormHelperText>}
          </Box>
          <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
            <NumberInput textAlign="right" placeholder="Enter amount" value={denom.percentage} onChange={() => {}} />
            <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      ))}
    </FormControl>
  );
}
