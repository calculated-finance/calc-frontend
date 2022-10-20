import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  SimpleGrid,
  Spacer,
  Text,
  Button,
  Center,
} from '@chakra-ui/react';
import usePairs, { uniqueBaseDenoms } from '@hooks/usePairs';
import useBalance from '@hooks/useBalance';
import { useField } from 'formik';
import InitialDeposit from '../InitialDeposit';
import { DenomSelect } from '../../../../components/DenomSelect';

// TODO: make this generic
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

// its rough to name this quote denom, change to something more generic like "starting denom"
export default function InitialDenom() {
  const { data } = usePairs();
  const { pairs } = data || {};
  const [field, meta, helpers] = useField({ name: 'initialDenom' });
  const [, , initialDepositHelpers] = useField('initialDeposit');

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
            denoms={uniqueBaseDenoms(pairs)}
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
