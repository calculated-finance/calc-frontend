import {
  Box,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useField } from 'formik';
import useValidators from '@hooks/useValidators';
import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import Select from './Select';

export function DummyAutoStakeValidator() {
  const [field, meta] = useField({ name: 'autoStakeValidator' });
  return (
    <FormControl isDisabled isInvalid={Boolean(meta.touched && meta.error)}>
      <Box w="full" h="full" position="relative">
        <Center h="full" w="full" zIndex={10} position="absolute" backdropFilter="auto" backdropBlur="1px">
          <Heading size="xs">Cross chain staking coming soon</Heading>
        </Center>
        <FormLabel>Choose Validator</FormLabel>
        <FormHelperText>
          <Text textStyle="body-xs">
            CALC supports diversification of voting power, please don&apos;t just choose the validators with the most
            voting power.
          </Text>
        </FormHelperText>
        <Select value="" onChange={() => null} options={[]} placeholder="Select or search for validator" />
      </Box>

      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

export default function AutoStakeValidator() {
  const [field, meta, helpers] = useField({ name: 'autoStakeValidator' });
  const { validators } = useValidators();

  const options = validators?.map((validator: Validator) => ({
    value: validator.operatorAddress,
    label:
      validator.description && validator.description.moniker
        ? validator.description.moniker
        : validator.operatorAddress,
  }));

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Choose Validator</FormLabel>
      <FormHelperText>
        <Text textStyle="body-xs">
          CALC supports diversification of voting power, please don&apos;t just choose the validators with the most
          voting power.
        </Text>
      </FormHelperText>
      {!options ? (
        <Spinner size="xs" />
      ) : (
        <Select
          value={field.value}
          options={options}
          placeholder="Select or type validator name"
          onChange={helpers.setValue}
          menuPortalTarget={!process.env.PORTAL_SELECT_DISABLED ? document.body : undefined}
        />
      )}
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
