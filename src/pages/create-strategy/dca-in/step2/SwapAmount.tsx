import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Text,
  Image,
  InputRightElement,
} from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';
import useDcaInForm from 'src/hooks/useDcaInForm';

export default function SwapAmount() {
  const { state } = useDcaInForm();

  const { icon, name } = getDenomInfo(state.step1.baseDenom);
  const { initialDeposit } = state.step1;

  const validate = (value: number) => {
    // fix this null check by passing validation when fetching state, to assure its there
    if (value > (initialDeposit ?? 0)) {
      return `Amount must be less than ${initialDeposit} ${name}`;
    }
    return undefined;
  };

  const [field, meta] = useField({ name: 'swapAmount', validate });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>How much {name} each purchase?</FormLabel>
      <FormHelperText>
        <Flex>
          <Text>The amount you want swapped each purchase for KUJI.</Text>
          <Spacer />
          <Text>Max:&nbsp;{new Intl.NumberFormat().format(initialDeposit || 0) ?? '-'}</Text>
        </Flex>
      </FormHelperText>
      <InputGroup>
        <InputLeftElement>
          <Image src={icon} />
        </InputLeftElement>
        <Input type="number" placeholder="Enter amount" {...field} />
        <InputRightElement textAlign="right" mr={3} textStyle="body-xs">
          <Text>{name}</Text>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}
