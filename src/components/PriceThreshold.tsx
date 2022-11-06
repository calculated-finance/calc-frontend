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
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import NumberInput from '@components/NumberInput';
import { useStep2Form } from '@hooks/useDcaInForm';
import usePrice from '@hooks/usePrice';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';

import YesNoValues from '@models/YesNoValues';
import RadioCard from './RadioCard';
import Radio from './Radio';
import { yesNoData } from '../pages/create-strategy/dca-in/customise/yesNoData';

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

type PriceThresholdProps = {
  title: string;
  description: string;
};

export default function PriceThreshold({ title, description }: PriceThresholdProps) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'priceThresholdValue' });
  const { state } = useStep2Form();
  const [priceThresholdField] = useField({ name: 'priceThresholdEnabled' });

  const { price, pairAddress, isLoading } = usePrice(state?.step1.resultingDenom, state?.step1.initialDenom);

  if (!state) {
    return null;
  }

  const { name: resultingDenomName } = getDenomInfo(state.step1.resultingDenom);
  const { name: initialDenomName } = getDenomInfo(state.step1.initialDenom);

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
                  <DenomIcon denomName={state.step1.resultingDenom} />{' '}
                  <Text fontSize="sm">{resultingDenomName} Price</Text>
                </HStack>
              }
            />
            <NumberInput textAlign="right" pr={16} placeholder="0.00" onChange={helpers.setValue} {...field} />
            <InputRightElement mr={3} pointerEvents="none" children={<Text fontSize="sm">{initialDenomName}</Text>} />
          </InputGroup>
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
          {Boolean(price) && (
            <FormHelperText>
              <Link isExternal href={`https://fin.kujira.app/trade/${pairAddress}`}>
                <Button variant="link" fontWeight="normal" isLoading={isLoading} colorScheme="blue">
                  Current price: 1 {resultingDenomName} = {price} {initialDenomName}
                </Button>
              </Link>
            </FormHelperText>
          )}
        </Box>
      </Collapse>
    </FormControl>
  );
}
