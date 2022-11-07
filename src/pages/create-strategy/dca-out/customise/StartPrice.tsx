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
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import NumberInput from '@components/NumberInput';
import { FormNames, useStep2Form } from '@hooks/useDcaInForm';
import usePrice from '@hooks/usePrice';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';

export default function StartPrice() {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'startPrice' });
  const { state } = useStep2Form(FormNames.DcaOut);
  const { price, pairAddress, isLoading } = usePrice(state?.step1.resultingDenom, state?.step1.initialDenom);

  if (!state) {
    return null;
  }

  const { name: resultingDenomName } = getDenomInfo(state.step1.resultingDenom);
  const { name: initialDenomName } = getDenomInfo(state.step1.initialDenom);

  return (
    <FormControl mt={3} isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>Strategy start price</FormLabel>
      <FormHelperText>When this price is hit, your DCA will begin</FormHelperText>
      <InputGroup>
        <InputLeftElement
          w={32}
          pointerEvents="none"
          children={
            <HStack direction="row">
              <DenomIcon denomName={state.step1.initialDenom} /> <Text fontSize="sm">{initialDenomName} Price</Text>
            </HStack>
          }
        />
        <NumberInput textAlign="right" pr={16} placeholder="0.00" onChange={helpers.setValue} {...field} />
        <InputRightElement mr={3} pointerEvents="none" children={<Text fontSize="sm">{resultingDenomName}</Text>} />
      </InputGroup>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
      {Boolean(price) && (
        <FormHelperText>
          <Link isExternal href={`https://fin.kujira.app/trade/${pairAddress}`}>
            <Button variant="link" fontWeight="normal" isLoading={isLoading} colorScheme="blue">
              Current price: 1 {initialDenomName} = {price} {resultingDenomName}
            </Button>
          </Link>
        </FormHelperText>
      )}
    </FormControl>
  );
}
