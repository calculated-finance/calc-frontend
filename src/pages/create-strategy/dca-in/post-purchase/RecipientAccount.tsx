import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, InputGroup } from '@chakra-ui/react';
import { useField } from 'formik';

export default function RecipientAccount() {
  const [field, meta] = useField({ name: 'recipientAccount' });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Choose Account</FormLabel>
      <FormHelperText color="red.200" fontSize="xs">
        Sending funds to an incorrect wallet address will result in loss of funds.
      </FormHelperText>
      <InputGroup>
        <Input placeholder="Input Wallet" {...field} />
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}
