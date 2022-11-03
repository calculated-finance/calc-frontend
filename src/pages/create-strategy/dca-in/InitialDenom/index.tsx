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
  Button,
  Center,
} from '@chakra-ui/react';
import usePairs, { uniqueQuoteDenoms } from '@hooks/usePairs';
import { Denom } from '@models/Denom';
import useBalance from '@hooks/useBalance';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';
import DenomIcon from '@components/DenomIcon';
import InitialDeposit from '../InitialDeposit';
import { DenomSelect } from '../../../../components/DenomSelect';

export function DenomSelectLabel({ denom }: { denom: Denom }) {
  return (
    <HStack spacing={2} w="full">
      <DenomIcon denomName={denom} />
      <Text>{getDenomInfo(denom).name}</Text>
    </HStack>
  );
}

function AvailableFunds() {
  const [field] = useField({ name: 'initialDenom' });

  const initialDenom = field.value;

  const { displayAmount, isLoading } = useBalance({
    token: initialDenom,
  });

  const [, , helpers] = useField('initialDeposit');

  const handleClick = () => {
    helpers.setValue(displayAmount);
  };

  if (!initialDenom) {
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

export default function InitialDenom() {
  const { data } = usePairs();
  const { pairs } = data || {};
  const [field, meta, helpers] = useField({ name: 'initialDenom' });

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
            denoms={uniqueQuoteDenoms(pairs)}
            placeholder="Choose asset"
            value={field.value}
            onChange={helpers.setValue}
          />
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        </Box>
        <InitialDeposit />
      </SimpleGrid>
    </FormControl>
  );
}
