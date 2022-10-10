import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  InputRightElement,
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import { useStep2Form } from '@hooks/useDcaInForm';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';

export default function StartPrice() {
  const [field, meta] = useField({ name: 'startPrice' });
  const { state } = useStep2Form();

  if (!state) {
    return null;
  }

  const { name: baseDenomName } = getDenomInfo(state.step1.baseDenom);
  const { name: quoteDenomName } = getDenomInfo(state.step1.quoteDenom);

  return (
    <FormControl mt={3} isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>Strategy start price</FormLabel>
      <FormHelperText>When this price is hit, your DCA In strategy will begin</FormHelperText>
      <InputGroup>
        <InputLeftElement
          w={32}
          pointerEvents="none"
          children={
            <HStack direction="row">
              <DenomIcon denomName={state.step1.baseDenom} /> <Text fontSize="sm">{baseDenomName} Price</Text>
            </HStack>
          }
        />
        <Input type="number" textAlign="right" pr={16} placeholder="0.00" {...field} />
        <InputRightElement mr={3} pointerEvents="none" children={<Text fontSize="sm">{quoteDenomName}</Text>} />
      </InputGroup>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
