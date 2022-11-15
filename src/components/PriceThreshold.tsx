import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  InputGroup,
  InputLeftElement,
  Text,
  InputRightElement,
  Button,
  Link,
  useRadioGroup,
  Collapse,
  Box,
  Center,
  Heading,
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import NumberInput from '@components/NumberInput';
import { FormNames, useStep2Form } from '@hooks/useDcaInForm';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';

import YesNoValues from '@models/YesNoValues';
import usePrice from '@hooks/usePrice';
import { useState } from 'react';
import RadioCard from './RadioCard';
import Radio from './Radio';
import { yesNoData } from '../pages/create-strategy/dca-in/customise/yesNoData';
import { TransactionType } from './TransactionType';

function DummyPriceThresholdToggle({
  value,
  onChange,
}: {
  value: YesNoValues;
  onChange: (value: YesNoValues) => void;
}) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    value,
    onChange,
  });

  return (
    <FormControl>
      <HStack>
        <Radio {...getRootProps}>
          {yesNoData.map((option) => {
            const radio = getRadioProps({ value: option.value });
            return (
              <RadioCard key={option.label} {...radio}>
                {option.label}
              </RadioCard>
            );
          })}
        </Radio>
      </HStack>
    </FormControl>
  );
}

function PriceThresholdToggle() {
  const [field, , helpers] = useField({ name: 'priceThresholdEnabled' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <HStack>
        <Radio {...getRootProps}>
          {yesNoData.map((option) => {
            const radio = getRadioProps({ value: option.value });
            return (
              <RadioCard key={option.label} {...radio}>
                {option.label}
              </RadioCard>
            );
          })}
        </Radio>
      </HStack>
    </FormControl>
  );
}

export function DummyPriceThreshold({ title, description, formName, transactionType }: PriceThresholdProps) {
  const { state } = useStep2Form(formName);
  const { price, pairAddress, isLoading } = usePrice(
    state?.step1.resultingDenom,
    state?.step1.initialDenom,
    transactionType,
  );

  const [value, setValue] = useState<YesNoValues>(YesNoValues.No);

  if (!state) {
    return null;
  }

  const priceOfDenom = transactionType === 'buy' ? state?.step1.resultingDenom : state?.step1.initialDenom;
  const priceInDenom = transactionType === 'buy' ? state?.step1.initialDenom : state?.step1.resultingDenom;

  const { name: priceOfDenomName } = getDenomInfo(priceOfDenom);
  const { name: priceInDenomName } = getDenomInfo(priceInDenom);
  return (
    <FormControl>
      <FormLabel>{title}</FormLabel>
      <FormHelperText>{description}</FormHelperText>
      <DummyPriceThresholdToggle value={value} onChange={setValue} />
      <Collapse in={value === YesNoValues.Yes}>
        <Box m="px" mt={3} position="relative">
          <Center h="full" w="full" zIndex={10} position="absolute" backdropFilter="auto" backdropBlur="1px">
            <Heading size="xs">Price floor coming November 27th</Heading>
          </Center>
          <InputGroup>
            <InputLeftElement
              w={32}
              pointerEvents="none"
              children={
                <HStack direction="row">
                  <DenomIcon denomName={priceOfDenom} /> <Text fontSize="sm">{priceOfDenomName} Price</Text>
                </HStack>
              }
            />
            <NumberInput textAlign="right" pr={16} placeholder="0.00" onChange={() => {}} />
            <InputRightElement mr={3} pointerEvents="none" children={<Text fontSize="sm">{priceInDenomName}</Text>} />
          </InputGroup>
          <FormHelperText>
            <Link isExternal href={`https://fin.kujira.app/trade/${pairAddress}`}>
              <Button variant="link" fontWeight="normal" isLoading={isLoading} colorScheme="blue">
                Current price: 1 {priceOfDenomName} = {price} {priceInDenomName}
              </Button>
            </Link>
          </FormHelperText>
        </Box>
      </Collapse>
    </FormControl>
  );
}

type PriceThresholdProps = {
  title: string;
  description: string;
  formName: FormNames;
  transactionType: TransactionType;
};

export default function PriceThreshold({ title, description, formName, transactionType }: PriceThresholdProps) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'priceThresholdValue' });
  const { state } = useStep2Form(formName);
  const [priceThresholdField] = useField({ name: 'priceThresholdEnabled' });

  const { price, pairAddress, isLoading } = usePrice(
    state?.step1.resultingDenom,
    state?.step1.initialDenom,
    transactionType,
  );

  if (!state) {
    return null;
  }

  const priceOfDenom = transactionType === 'buy' ? state?.step1.resultingDenom : state?.step1.initialDenom;
  const priceInDenom = transactionType === 'buy' ? state?.step1.initialDenom : state?.step1.resultingDenom;

  const { name: priceOfDenomName } = getDenomInfo(priceOfDenom);
  const { name: priceInDenomName } = getDenomInfo(priceInDenom);

  return (
    <FormControl isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>{title}</FormLabel>
      <FormHelperText>{description}</FormHelperText>
      <PriceThresholdToggle />
      <Collapse in={priceThresholdField.value === YesNoValues.Yes}>
        <Box m="px" mt={3}>
          <InputGroup>
            <InputLeftElement
              w={32}
              pointerEvents="none"
              children={
                <HStack direction="row">
                  <DenomIcon denomName={priceOfDenom} /> <Text fontSize="sm">{priceOfDenomName} Price</Text>
                </HStack>
              }
            />
            <NumberInput textAlign="right" pr={16} placeholder="0.00" onChange={helpers.setValue} {...field} />
            <InputRightElement mr={3} pointerEvents="none" children={<Text fontSize="sm">{priceInDenomName}</Text>} />
          </InputGroup>
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
          {Boolean(price) && (
            <FormHelperText>
              <Link isExternal href={`https://fin.kujira.app/trade/${pairAddress}`}>
                <Button variant="link" fontWeight="normal" isLoading={isLoading} colorScheme="blue">
                  Current price: 1 {priceOfDenomName} = {price} {priceInDenomName}
                </Button>
              </Link>
            </FormHelperText>
          )}
        </Box>
      </Collapse>
    </FormControl>
  );
}
