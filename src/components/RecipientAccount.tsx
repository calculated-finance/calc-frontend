import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, InputGroup } from '@chakra-ui/react';
import { getChainCosmosName } from '@helpers/chains';
import { useChainId } from '@hooks/useChainId';
import { useField } from 'formik';

export default function RecipientAccount() {
  const [field, meta] = useField({ name: 'recipientAccount' });
  const { chainId: chain } = useChainId();

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Choose Account</FormLabel>
      <FormHelperText>This wallet address will be the one the funds are sent to.</FormHelperText>
      <InputGroup>
        <Input fontSize="sm" placeholder="Input Wallet" {...field} />
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
      <FormHelperText>Ensure that this is a valid {getChainCosmosName(chain)} address.</FormHelperText>
    </FormControl>
  );
}
