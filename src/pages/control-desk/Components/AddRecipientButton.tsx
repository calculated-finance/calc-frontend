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


export type RecipientArrayFormValues = {
  recipientArray: {
    recipientAddress: string,
    amount: number
  }[]
}


export function RecipientAccountControlDesk() {

  const { register, formState: { errors }, control } = useForm<RecipientArrayFormValues>({
    defaultValues: {
      recipientArray:
        [{
          recipientAddress: '', amount: 0
        }]
    }
  });

  const [recipientArrayField, recipientArrayMeta, recipientArrayHelpers] = useField({ name: 'recipientArray' });

  const { fields, remove, append } = useFieldArray({
    name: 'recipientArray',
    control,
  })



  const { chain } = useChain();

  const handleAppend = () => {
    append({
      recipientAddress: '',
      amount: 0
    });
  }

  console.log(recipientArrayField, 'need')
  console.log(fields)



  return (
    // <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
    <FormControl isInvalid={Boolean(false)}>
      <FormLabel>Choose Account</FormLabel>
      <FormHelperText>This wallet address will be the one the funds are sent to.</FormHelperText>
      <SimpleGrid columns={2}>
        <FormHelperText textAlign='left'>Recipient:</FormHelperText>
        <FormHelperText textAlign='right' >Amount:</FormHelperText>
      </SimpleGrid>
      {fields.map((arrayField, index) =>
        <InputGroup mb={2} key={arrayField.id}>
          <HStack spacing={2} w='full'>
            {index === 0 ? undefined :
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
            }

            <Input fontSize="sm" placeholder="Address" w='full' {...register(`recipientArray.${index}.recipientAddress`)} />
            <Input fontSize="sm" textAlign='right' maxW={28} type='number'  {...register(`recipientArray.${index}.amount`, { valueAsNumber: true })} />
          </HStack>
        </InputGroup>
      )}

      <FormErrorMessage>{errors.recipientArray?.root?.message}</FormErrorMessage>
      {/* <FormErrorMessage>{meta.error}</FormErrorMessage> */}
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


