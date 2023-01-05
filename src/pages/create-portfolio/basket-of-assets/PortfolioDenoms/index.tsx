import {
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
import usePairs from '@hooks/usePairs';
import { Denom } from '@models/Denom';
import getDenomInfo, { isDenomVolatile } from '@utils/getDenomInfo';
import { useField } from 'formik';
import DenomIcon from '@components/DenomIcon';
import { DenomSelect } from '@components/DenomSelect';
import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import { FiPlusCircle, FiStopCircle, FiTrash } from 'react-icons/fi';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import { Remove1Icon, Remove2Icon } from '@fusion-icons/react/interface';
// calc icon
import CalcIcon from '@components/Icon';

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

  const denoms = SUPPORTED_DENOMS.filter((denom) => !chosenDenoms.includes(denom));

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
      <Flex align="center">
        {/* delete button */}
        {Boolean(index) && (
          <Button onClick={handleDelete} variant="ghost" colorScheme="red">
            <CalcIcon as={Remove2Icon} stroke="red.200" />
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
        <Button
          alignItems="center"
          w="min-content"
          size="sm"
          onClick={handleAdd}
          variant="ghost"
          leftIcon={<Icon as={FiPlusCircle} />}
          type="button"
        >
          Add asset
        </Button>
      </Stack>
      <FormErrorMessage>{meta.touched && Array.isArray(meta.error) ? meta.error[0] : meta.error}</FormErrorMessage>
    </FormControl>
  );
}
