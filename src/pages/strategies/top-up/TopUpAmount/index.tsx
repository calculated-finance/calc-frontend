import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Spacer,
  Text,
  Button,
  Center,
} from '@chakra-ui/react';
import { Denom } from '@models/Denom';
import useBalance from '@hooks/useBalance';
import { useField } from 'formik';
import { DenomInput } from '@components/DenomInput';

function TopUpAvailableFunds({ initialDenom }: { initialDenom: Denom }) {
  const { displayAmount, isLoading } = useBalance({
    token: initialDenom,
  });

  const [, , helpers] = useField('topUpAmount');

  const handleClick = () => {
    helpers.setValue(displayAmount);
  };

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

export default function TopUpAmount({ initialDenom, convertedSwapAmount }: { initialDenom: Denom, convertedSwapAmount: number}) {
  const [field, meta] = useField({ name: 'topUpAmount' });
  const additionalSwapAmount = Math.ceil((field.value)/(convertedSwapAmount));
  const displaySwaps = additionalSwapAmount > 1 ? `${additionalSwapAmount} swaps` : 'swap';
  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>How much do you want to add?</FormLabel>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">You must deposit the same asset.</Text>
          <Spacer />
          <TopUpAvailableFunds initialDenom={initialDenom} />
        </Center>
      </FormHelperText>
      <DenomInput data-testid="top-up-input" denom={initialDenom} {...field} />

      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
      {Boolean(field.value) && !meta.error && (
        <FormHelperText color="brand.200" fontSize="xs">
          An additional {displaySwaps} will be added to your strategy.
        </FormHelperText>
      )}
    </FormControl>
  );
}
