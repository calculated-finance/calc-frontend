import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  SimpleGrid,
  Spacer,
  Text,
  Image,
  HStack,
  Button,
  Center,
} from '@chakra-ui/react';
import usePairs, { Denom, uniqueQuoteDenoms } from '@hooks/usePairs';
import useBalance from '@hooks/useBalance';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';
import { useWallet } from '@wizard-ui/react';
import InitialDeposit from './InitialDeposit';
import Select from './Select';

export function DenomSelectLabel({ denom }: { denom: Denom }) {
  return (
    <HStack spacing={2} w="full">
      <Image src={getDenomInfo(denom).icon} alt={getDenomInfo(denom).name} />
      <Text>{getDenomInfo(denom).name}</Text>
    </HStack>
  );
}

function AvailableFunds() {
  const [field] = useField({ name: 'quoteDenom' });

  const quoteDenom = field.value;

  const { displayAmount, isLoading } = useBalance({
    token: quoteDenom,
  });

  const [, , meta] = useField('initialDeposit');

  const handleClick = () => {
    meta.setValue(displayAmount);
  };

  if (!quoteDenom) {
    return null;
  }

  return (
    <Center textStyle="body-xs">
      <Text mr={1}>Available: </Text>
      <Button
        size="xs"
        isLoading={isLoading}
        colorScheme="blue"
        variant="link"
        cursor="pointer"
        isDisabled={!displayAmount}
        onClick={handleClick}
      >
        {displayAmount || 'None'}
      </Button>
    </Center>
  );
}

export default function QuoteDenom() {
  const { data } = usePairs();
  const { pairs } = data || {};
  const [field, meta, helpers] = useField({ name: 'quoteDenom' });

  const pairsOptions = uniqueQuoteDenoms(pairs).map((denom) => ({
    value: denom,
    label: <DenomSelectLabel denom={denom} />,
  }));

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
          <Select options={pairsOptions} placeholder="Choose asset" value={field.value} onChange={helpers.setValue} />
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        </Box>
        <InitialDeposit />
      </SimpleGrid>
    </FormControl>
  );
}
