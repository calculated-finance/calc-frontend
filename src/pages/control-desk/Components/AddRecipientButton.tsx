import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  SimpleGrid,
  Spacer,
} from "@chakra-ui/react";
import { useChain } from "@hooks/useChain";
import { Chains } from "@hooks/useChain/Chains";
import { useField } from "formik";
import { useFieldArray, useForm } from "react-hook-form";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";


type RecipientArrayFormValues = {
  recipientArray: {
    recipientAddress: string,
    amount: number
  }[]
}


export function RecipientAccountControlDesk() {
  const [field, meta] = useField({ name: 'recipientsArray' });

  const { register, formState: { errors }, control } = useForm({
    defaultValues: {
      recipientArray:
        [{ recipientAddress: '', amount: 0 }]
    }
  }
  );
  const { fields, remove, append } = useFieldArray({
    name: 'recipientArray',
    control,
    // rules:{
    //   validate: 
    // }

  })
  const { chain } = useChain();

  const handleAppend = () => {
    append({
      recipientAddress: '',
      amount: 0
    })
  }


  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Choose Account</FormLabel>
      <FormHelperText>This wallet address will be the one the funds are sent to.</FormHelperText>
      <SimpleGrid columns={2}>

        <FormHelperText textAlign='left'>Wallet(s):</FormHelperText>
        <FormHelperText textAlign='right' >Amount:</FormHelperText>

      </SimpleGrid>
      <InputGroup mb={2} gap={2} >
        <Input fontSize="sm" placeholder="Input Wallet" w='full' {...field} />
        <Input fontSize="sm" defaultValue={0} textAlign='right' w='40%' />
      </InputGroup>


      {fields.map((arrayField, index) =>

        <InputGroup mb={2} key={arrayField.id} >
          <HStack spacing={2} w='full'>
            <Button
              size="xs"
              variant='ghost'
              width={4}
              bgColor='abyss.100'
              h={5}
              borderRadius={6}
              onClick={() => remove(index)}
              alignSelf='center'
            >
              <Icon as={FiMinusCircle} stroke="brand.200" width={3} height={3} />
            </Button>
            <Input fontSize="sm" placeholder="Input Wallet" w='full' {...register(`recipientArray.${index}.recipientAddress`)} />
            <Input fontSize="sm" placeholder="%" textAlign='right' w='45%' type='number' {...register(`recipientArray.${index}.amount`, { valueAsNumber: true })} />

          </HStack>
        </InputGroup>

      )}

      <FormErrorMessage>{meta.error}</FormErrorMessage>
      <FormHelperText>Ensure that this is a valid {Chains[chain]} address.</FormHelperText>

      <HStack pb={2}>
        <Button
          size="xs"
          variant='ghost'
          leftIcon={<Icon as={FiPlusCircle} stroke="brand.200" width={3} height={3} />}
          width={28}
          bgColor='abyss.100'
          fontSize='2xs'
          h={5}
          borderRadius={6}
          onClick={handleAppend}
        >
          Add recipient
        </Button>
        <Spacer />
      </HStack>
    </FormControl>
  );
}


