import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, InputGroup } from '@chakra-ui/react';
import { useField } from 'formik';

export default function RecipientAccount() {
  const [field, meta] = useField({ name: 'recipientAccount' });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Choose Account</FormLabel>
      <InputGroup>
        <Input fontSize="sm" placeholder="Input Wallet" {...field} />
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
      <FormHelperText>IBC transfers coming soon, please use a Kujira address.</FormHelperText>
    </FormControl>
  );
}
