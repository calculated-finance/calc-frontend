import {
  Box,
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
  Flex,
} from '@chakra-ui/react';
import usePairs, { Denom, uniqueBaseDenoms } from '@hooks/usePairs';
import useBalance from '@hooks/useBalance';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';
import { chakraComponents, OptionProps } from 'chakra-react-select';
import DenomIcon from '@components/DenomIcon';
import InitialDeposit from '../InitialDeposit';
import Select from '../../../../components/Select';

const customComponents = {
  Option: ({ children, ...props }: OptionProps) => (
    <chakraComponents.Option {...props}>
      {children}
      {/* TODO: make this styling better, dont hard code margin */}
      <Text w="full" ml={28} fontSize="xs">
        FIN
      </Text>
    </chakraComponents.Option>
  ),
};

export function DenomSelectLabel({ denom }: { denom: Denom }) {
  return (
    <HStack>
      <DenomIcon denomName={denom} />
      <Text>{getDenomInfo(denom).name}</Text>
    </HStack>
  );
}

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

  const pairsOptions = uniqueBaseDenoms(pairs).map((denom) => ({
    value: denom,
    label: <DenomSelectLabel denom={denom} />,
  }));

  const handleChange = (value: string | undefined) => {
    helpers.setValue(value);
    initialDepositHelpers.setTouched(false);
    initialDepositHelpers.setError(undefined);
    initialDepositHelpers.setValue('');
  };

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
          <Select
            options={pairsOptions}
            placeholder="Choose asset"
            value={field.value}
            onChange={handleChange}
            customComponents={customComponents}
          />
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        </Box>
        <InitialDeposit />
      </SimpleGrid>
    </FormControl>
  );
}
