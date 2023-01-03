import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { Swap2Icon } from '@fusion-icons/react/web3';
import Icon from '@components/Icon';
import NumberInput from '@components/NumberInput';

function SlippagePreset({ value }: { value: number }) {
  const [field, , helpers] = useField('slippageTolerance');

  const enabled = field.value === value;

  const handleClick = () => {
    helpers.setValue(value);
  };

  return (
    <Box
      borderRadius="full"
      px={3}
      borderWidth={1}
      borderColor={enabled ? 'brand.200' : 'slateGrey'}
      color={enabled ? 'brand.200' : 'slateGrey'}
      _hover={{ color: !enabled && 'blue.200', borderColor: !enabled && 'blue.200' }}
      onClick={handleClick}
      cursor="pointer"
    >
      {value}%
    </Box>
  );
}

export default function SlippageTolerance() {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'slippageTolerance' });
  const values = [0.5, 1.0, 2.0];

  return (
    <FormControl mt={3} isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>Set slippage tolerance</FormLabel>
      <FormHelperText>
        If the slippage exceeds your tolerance, the swap will fail, be skipped for that increment and your strategy
        length will increase by 1 increment.
      </FormHelperText>
      <HStack spacing={2}>
        <InputGroup w={154} ml="px">
          <InputLeftElement pointerEvents="none" h="full" children={<Icon as={Swap2Icon} stroke="slateGrey" />} />
          <NumberInput pl={8} placeholder="0.0" onChange={helpers.setValue} {...field} />
          <InputRightElement pointerEvents="none" children="%" />
        </InputGroup>
        <HStack spacing={1}>
          {values.map((presetValue) => (
            <SlippagePreset value={presetValue} />
          ))}
        </HStack>
      </HStack>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
