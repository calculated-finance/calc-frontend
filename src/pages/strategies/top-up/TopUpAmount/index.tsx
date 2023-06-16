import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Spacer,
  Text,
  Button,
  Center,
  Image,
  HStack,
  Box,
  Stack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import useBalance from '@hooks/useBalance';
import { useField } from 'formik';
import { DenomInput } from '@components/DenomInput';
import { getConvertedSwapAmount, getStrategyInitialDenom } from '@helpers/strategy';
import { Strategy } from '@hooks/useStrategies';
import { Pages } from '@components/Layout/Sidebar/Pages';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { DenomInfo } from '@utils/DenomInfo';
import LinkWithQuery from '@components/LinkWithQuery';

function TopUpAvailableFunds({ initialDenom }: { initialDenom: DenomInfo }) {
  const { displayAmount, isLoading } = useBalance(initialDenom);

  const [, , helpers] = useField('topUpAmount');

  const handleClick = () => {
    helpers.setValue(displayAmount);
  };

  return (
    <Center textStyle="body-xs">
      <Text mr={1}>Max: </Text>
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

export default function TopUpAmount({ strategy }: { strategy: Strategy }) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'topUpAmount' });
  const convertedSwapAmount = getConvertedSwapAmount(strategy);
  const initialDenom = getStrategyInitialDenom(strategy);
  const additionalSwaps = Math.ceil(field.value / convertedSwapAmount);
  const displaySwaps = additionalSwaps > 1 ? `${additionalSwaps} swaps` : 'swap';

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
      <DenomInput data-testid="top-up-input" denom={initialDenom} onChange={helpers.setValue} {...field} />

      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
      {Boolean(field.value) && !meta.error && (
        <Stack>
          <FormHelperText color="brand.200" fontSize="xs">
            An additional {displaySwaps} will be added to your strategy.
          </FormHelperText>
          {isDcaPlus(strategy) && additionalSwaps > 180 && (
            <Box fontSize="xs" bg="abyss.200" p={4} borderRadius="md">
              <HStack spacing={3} color="brand.200">
                <Image src="/images/lightBulbOutline.svg" alt="light bulb" />
                <Text>
                  Please note that this will increase your strategy duration by more than 6 months. Perhaps it&apos;s
                  best to{' '}
                  <LinkWithQuery href={Pages.CreateStrategy} passHref>
                    <ChakraLink color="brand.200">start a new strategy</ChakraLink>
                  </LinkWithQuery>{' '}
                  with a higher daily base allocation.
                </Text>
              </HStack>
            </Box>
          )}
        </Stack>
      )}
    </FormControl>
  );
}
