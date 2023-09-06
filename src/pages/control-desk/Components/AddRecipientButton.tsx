import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  Spacer,
} from "@chakra-ui/react";
import { Remove2Icon } from "@fusion-icons/react/interface";
import { useChain } from "@hooks/useChain";
import { Chains } from "@hooks/useChain/Chains";
import { useField } from "formik";
import { FiPlusCircle } from "react-icons/fi";


export function RecipientAccountControlDesk() {
  const [field, meta] = useField({ name: 'recipientAccount' });
  const [{ value: totalRecipientsValue }, , { setValue: totalRecipientsSetValue }] = useField({ name: 'totalRecipients' });
  const { chain } = useChain();

  const recipients = [<InputGroup>
    <Input fontSize="sm" placeholder="Input Wallet" {...field} w='full' />
    <Spacer />

    <Button alignSelf='center' ml={2} variant='ghost'>
      <Icon as={Remove2Icon} stroke="brand.200" width={4} height={4} alignSelf='center' />
    </Button>
  </InputGroup>]


  const handleClick = () => {

    console.log('clicked')

  }

  console.log(totalRecipientsValue)



  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Choose Account</FormLabel>
      <FormHelperText>This wallet address will be the one the funds are sent to.</FormHelperText>
      {recipients}
      <FormErrorMessage>{meta.error}</FormErrorMessage>
      <FormHelperText>Ensure that this is a valid {Chains[chain]} address.</FormHelperText>
      <Button
        size="xs"
        variant='ghost'
        leftIcon={<Icon as={FiPlusCircle} stroke="brand.200" width={3} height={3} />}
        width={28}
        bgColor='abyss.100'
        fontSize='2xs'
        h={5}
        borderRadius={6}
        onClick={handleClick}
      >
        Add recipient
      </Button>
    </FormControl>
  );
}


