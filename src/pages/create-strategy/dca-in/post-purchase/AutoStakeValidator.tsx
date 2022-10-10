import { Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, HStack, Text } from '@chakra-ui/react';
import { useField } from 'formik';
import { chakraComponents, OptionProps } from 'chakra-react-select';
import { useQuery } from '@tanstack/react-query';
import Select from '../Select';

export default function AutoStakeValidator() {
  const [field, meta, helpers] = useField({ name: 'autoStakeValidator' });

  const { data, isLoading } = useQuery(['validators'], async () => {
    const response = await fetch('https://kujira-api.polkachu.com/cosmos/staking/v1beta1/validators');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  const validatorOptions = data?.validators.map(
    (validator: any) =>
      ({
        value: validator.operator_address,
        label: validator.description.moniker,
      } || []),
  );

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
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
      <Select
        value={field.value}
        options={validatorOptions}
        placeholder="Choose validator"
        onChange={helpers.setValue}
        menuPortalTarget={document.body}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
