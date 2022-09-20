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
import { useStep2Form } from 'src/hooks/useDcaInForm';

export default function SwapAmount() {
  const { state } = useStep2Form();

  const { icon, name } = getDenomInfo(state!.step1.baseDenom);
  const { initialDeposit } = state!.step1;

  const [{ value, onChange, ...field }, meta, helpers] = useField({ name: 'swapAmount' });

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const numberValue = e.currentTarget.value;
    helpers.setValue(numberValue === '' ? null : numberValue);
  };

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>How much {name} each purchase?</FormLabel>
      <FormHelperText>
        <Flex>
          <Text>The amount you want swapped each purchase for KUJI.</Text>
          <Spacer />
          <Text>Max:&nbsp;{new Intl.NumberFormat().format(initialDeposit || 0) ?? '-'}</Text>
        </Flex>{' '}
      </FormHelperText>
      <InputGroup>
        <InputLeftElement>
          <Image src={icon} />
        </InputLeftElement>
        <Input
          type="number"
          onChange={handleChange}
          placeholder="Enter amount"
          value={value === null ? undefined : value}
          {...field}
        />
        <InputRightElement textAlign="right" mr={3} textStyle="body-xs">
          <Text>{name}</Text>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}
