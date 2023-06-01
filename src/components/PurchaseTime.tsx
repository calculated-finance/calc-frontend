import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { FiClock } from 'react-icons/fi';

export default function PurchaseTime({ title, subtitle }: { title: string; subtitle?: string }) {
  const [field, meta] = useField({ name: 'purchaseTime' });
  const [startDateField] = useField({ name: 'startDate' });

  const zone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];

  return (
    <FormControl mt={3} isInvalid={meta.touched && Boolean(meta.error)} isDisabled={!startDateField.value}>
      <FormLabel>{title}</FormLabel>
      <FormHelperText>{subtitle}</FormHelperText>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          h="full"
          children={
            <HStack ml={10} spacing={2}>
              <Icon as={FiClock} />
              <Text fontSize="sm">Time</Text>
            </HStack>
          }
        />
        <Input pr={20} textAlign="right" placeholder="HH:MM" {...field} />
        <InputRightElement mr={6} pointerEvents="none" children={zone} whiteSpace="nowrap" />
      </InputGroup>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
