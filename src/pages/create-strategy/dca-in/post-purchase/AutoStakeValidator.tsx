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
import SendToWalletValues from '@models/SendToWalletValues';
import useValidators, { Validator } from '@hooks/useValidators';
import Select from '../../../../components/Select';
import 'isomorphic-fetch';

export function DummyAutoStakeValidator() {
  return (
    <Box w="full" h="full" position="relative">
      <Center h="full" w="full" zIndex={10} position="absolute" backdropFilter="auto" backdropBlur="1px">
        <Heading size="xs">Cross chain staking coming soon</Heading>
      </Center>
      <FormControl isDisabled>
        <FormHelperText>
          <Text textStyle="body-xs" color="blue.200">
            Auto compounding coming soon.
          </Text>
        </FormHelperText>
        <FormLabel>Choose Validator</FormLabel>
        <FormHelperText>
          <Text textStyle="body-xs">
            CALC supports diversification of voting power, please don&apos;t just choose the validators with the most
            voting power.
          </Text>
        </FormHelperText>
        <Select value="" onChange={() => null} options={[]} placeholder="Select or search for validator" />
      </FormControl>
    </Box>
  );
}

export default function AutoStakeValidator() {
  const [field, meta, helpers] = useField({ name: 'autoStakeValidator' });
  const [sendToWalletfield] = useField({ name: 'sendToWallet' });
  const validators = useValidators();

  const options = validators?.map((validator: Validator) => ({
    value: validator.operator_address,
    label:
      validator.description && validator.description.moniker
        ? validator.description.moniker
        : validator.operator_address,
  }));

  return (
    <FormControl
      isInvalid={Boolean(meta.touched && meta.error)}
      isDisabled={sendToWalletfield.value === SendToWalletValues.No}
    >
      <FormHelperText>
        <Text textStyle="body-xs" color="blue.200">
          Auto compounding coming soon.
        </Text>
      </FormHelperText>
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
