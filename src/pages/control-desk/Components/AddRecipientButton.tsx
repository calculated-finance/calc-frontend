import {
  Box,
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
import { Field, FieldArray, useField } from "formik";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";

export function RecipientAccountControlDesk() {
  const [field, meta, helpers] = useField({ name: 'recipientArray' })

  const { chain } = useChain()

  console.log(field)

  return (
    // <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
    <FormControl isInvalid={Boolean(false)}>
      <FormLabel>Choose Account</FormLabel>
      <FormHelperText>This wallet address will be the one the funds are sent to.</FormHelperText>
      <SimpleGrid columns={2}>
        <FormHelperText textAlign='left'>Recipient:</FormHelperText>
        <FormHelperText textAlign='right' >Amount:</FormHelperText>
      </SimpleGrid>

      <FieldArray
        name="recipientArray"
        render={arrayHelpers => (
          <Box>

            {/* How does validation work on a 'per field' level. */}
            {field?.value?.map((friend, index) =>
              // It is better to pass in blank values into default value and the new rows. 

              <InputGroup mb={2} key={index}>
                <HStack spacing={2} w='full'>
                  {index === 0 ? undefined :
                    <Button
                      size="xs"
                      variant='ghost'
                      width={4}
                      bgColor='abyss.100'
                      h={5}
                      borderRadius={6}
                      onClick={() => arrayHelpers.remove(index)}
                      alignSelf='center'
                    >
                      <Icon as={FiMinusCircle} stroke="brand.200" width={3} height={3} />
                    </Button>
                  }
                  <Input as={Field} fontSize="sm" placeholder="Address" w='full' name={`recipientArray.${index}.recipientAccount`} />
                  <Input as={Field} fontSize="sm" textAlign='right' maxW={28} type='number' defaultValue={0} name={`recipientArray.${index}.amount`} />
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
                onClick={() => arrayHelpers.push({})}
              >
                Add recipient
              </Button>
              <Spacer />
            </HStack>
          </Box>)}

      />


    </FormControl>
  );
}


