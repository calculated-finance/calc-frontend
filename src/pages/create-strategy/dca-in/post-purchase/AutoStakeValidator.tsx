import {
  Box,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { useQuery } from '@tanstack/react-query';
import SendToWalletValues from '@models/SendToWalletValues';
import { REST_ENDPOINT } from 'src/constants';
import Select from '../../../../components/Select';

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

  const { data, isLoading } = useQuery(
    ['validators'],
    async () => {
      const response = await fetch(`${REST_ENDPOINT}/cosmos/staking/v1beta1/validators`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    {
      keepPreviousData: true,
    },
  );

  const validatorOptions = data?.validators
    ?.filter((v: any) => v.jailed === false)
    .map(
      (validator: any) =>
        ({
          value: validator.operator_address,
          label: validator.description.moniker,
        } || []),
    );
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
      {isLoading ? (
        <Spinner size="xs" />
      ) : (
        <Select
          value={field.value}
          options={validatorOptions}
          placeholder="Choose validator"
          onChange={helpers.setValue}
          menuPortalTarget={document.body}
        />
      )}
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
