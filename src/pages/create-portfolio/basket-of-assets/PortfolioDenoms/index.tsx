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
  Center,
  Button,
  Icon,
  Flex,
  Stack,
  Input,
} from '@chakra-ui/react';
import usePairs, { uniqueQuoteDenoms } from '@hooks/usePairs';
import { Denom } from '@models/Denom';
import getDenomInfo, { isDenomStable, isDenomVolatile } from '@utils/getDenomInfo';
import { useField } from 'formik';
import DenomIcon from '@components/DenomIcon';
import { AvailableFunds } from '@components/AvailableFunds';
import { DenomSelect } from '@components/DenomSelect';
import InitialDeposit from '../InitialDeposit';
import NumberInput from '@components/NumberInput';
import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { NumberFormatValues, NumericFormat, PatternFormat } from 'react-number-format';

export function DenomSelectLabel({ denom }: { denom: Denom }) {
  return (
    <HStack spacing={2} w="full">
      <DenomIcon denomName={denom} />
      <Text>{getDenomInfo(denom).name}</Text>
    </HStack>
  );
}

function DenomField({ index }: { index: number }) {
  const [field] = useField({ name: 'portfolioDenoms' });
  const chosenDenomsList = field.value.filter((_: any, i: number) => i !== index);
  const chosenDenoms = chosenDenomsList.map((item: any) => item.denom);

  const denoms = SUPPORTED_DENOMS.filter(isDenomVolatile).filter((denom) => !chosenDenoms.includes(denom));

  const [{ onChange: denomOnChange, ...denomField }, denomMeta, denomHelpers] = useField({
    name: `portfolioDenoms[${index}].denom`,
  });

  return (
    <FormControl isInvalid={Boolean(denomMeta.touched && denomMeta.error)}>
      <DenomSelect
        denoms={denoms}
        placeholder="Choose asset"
        {...denomField}
        showPromotion
        onChange={denomHelpers.setValue}
      />
      <FormErrorMessage>{denomMeta.touched && denomMeta.error}</FormErrorMessage>
    </FormControl>
  );
}

function PercentageField({ index }: { index: number }) {
  const [{ onChange: percentageOnChange, ...percentageField }, percentageMeta, percentageHelpers] = useField({
    name: `portfolioDenoms[${index}].percentage`,
  });
  const handleChange = (values: NumberFormatValues) => {
    percentageHelpers.setValue(values.value);
  };
  return (
    <FormControl isInvalid={Boolean(percentageMeta.touched && percentageMeta.error)}>
      <NumericFormat
        valueIsNumericString
        allowNegative={false}
        decimalScale={0}
        suffix="%"
        textAlign="right"
        customInput={Input}
        onValueChange={handleChange}
        placeholder="Enter percentage"
        {...percentageField}
      />
      <FormErrorMessage>{percentageMeta.touched && percentageMeta.error}</FormErrorMessage>
    </FormControl>
  );
}

function PortfolioDenom({ index }: any) {
  const [field, meta, helpers] = useField({ name: 'portfolioDenoms' });

  const handleDelete = () => {
    const newList = field.value.filter((_: any, i: number) => i !== index);
    helpers.setValue(newList);
  };

  return (
    <SimpleGrid columns={2} spacing={2}>
      <Flex>
        {/* delete button */}
        {Boolean(index) && (
          <Button onClick={handleDelete} variant="ghost" colorScheme="red">
            <Icon as={FiTrash} />
          </Button>
        )}
        <DenomField index={index} />
      </Flex>
      <PercentageField index={index} />
    </SimpleGrid>
  );
}

export default function PortfolioDenoms() {
  const { data } = usePairs();
  const { pairs } = data || {};
  const [field, meta, helpers] = useField({ name: 'portfolioDenoms' });

  if (!pairs) {
    return null;
  }
  const handleAdd = () => {
    const newList = field.value.concat({ denom: '', percentage: '' });
    helpers.setValue(newList);
  };

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Define your portfolio</FormLabel>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">Asset</Text>
          <Spacer />
          <Text textStyle="body-xs">Percentage</Text>
        </Center>
      </FormHelperText>
      <Stack>
        {field?.value?.map((denom: any, index: number) => (
          <PortfolioDenom index={index} />
        ))}
        <Button onClick={handleAdd} w="max-content" variant="outline" leftIcon={<Icon as={FiPlus} />}>
          Add
        </Button>
      </Stack>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
