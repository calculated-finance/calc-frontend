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
  Spacer,
} from "@chakra-ui/react";
import { useChain } from "@hooks/useChain";
import { Chains } from "@hooks/useChain/Chains";
import { useField } from "formik";
import { useState } from "react";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";


export function RecipientAccountControlDesk() {
  const [{ value: totalRecipientsValue }, , { setValue: totalRecipientsSetValue }] = useField({ name: 'totalRecipients' });
  const [field, meta] = useField({ name: 'recipientsArray' });
  const [additionalRecipientField] = useField({ name: 'recipientSchema' });

  console.log(additionalRecipientField)

  const { chain } = useChain();

  const [inputCount, setInputCount] = useState(1);

  const addInput = () => {
    setInputCount(inputCount + 1);
    totalRecipientsSetValue(inputCount)
  };

  const removeInput = () => {
    if (inputCount > 0) {
      setInputCount(inputCount - 1);
    }
    totalRecipientsSetValue(inputCount)
  };

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Choose Account</FormLabel>
      <FormHelperText>This wallet address will be the one the funds are sent to.</FormHelperText>
      <InputGroup mb={2} >
        <Input fontSize="sm" placeholder="Input Wallet" w='full' {...field} />
      </InputGroup>
      {[...Array(inputCount)].map((_, index) =>
        // Need to find a way to input different '...field's for Yup.
        <InputGroup mb={2} >
          <HStack spacing={2} w='full'>
            <Button
              size="xs"
              variant='ghost'
              width={4}
              bgColor='abyss.100'
              h={5}
              borderRadius={6}
              onClick={removeInput}
              alignSelf='center'
            >
              <Icon as={FiMinusCircle} stroke="brand.200" width={3} height={3} />
            </Button>
            <Input fontSize="sm" placeholder="Input Wallet" w='full' {...additionalRecipientField} />
          </HStack>
        </InputGroup>
      )}
      <FormErrorMessage>{meta.error}</FormErrorMessage>
      <FormHelperText>Ensure that this is a valid {Chains[chain]} address.</FormHelperText>
      {/* 
      <FieldArray name="recipientsArray">
        {({ push, remove }) => (
          <Box>
            {[...Array(inputCount)].map((_, index,) => (
              <InputGroup mb={2} key={`input-group-${index}`} >
                <HStack spacing={2} w="full">
                  {index > 0 &&
                    <Button
                      size="xs"
                      variant="ghost"
                      width={4}
                      bgColor="abyss.100"
                      h={5}
                      borderRadius={6}
                      onClick={() => {
                        removeInput();
                        remove(index);
                      }}
                      alignSelf="center"
                    >
                      <Icon as={FiMinusCircle} stroke="brand.200" width={3} height={3} />
                    </Button>
                  }
                  <Input
                    fontSize="sm"
                    placeholder="Input Wallet"
                    w="full"
                    name={`recipientsArray[${index}].recipientAccount`}
                  />
                </HStack>
              </InputGroup>
            ))}
            <FormErrorMessage>{meta.error}</FormErrorMessage>
            <FormHelperText>Ensure that this is a valid {Chains[chain]} address.</FormHelperText>
            <HStack pb={2}>
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<Icon as={FiPlusCircle} stroke="brand.200" width={3} height={3} />}
                width={28}
                bgColor="abyss.100"
                fontSize="2xs"
                h={5}
                borderRadius={6}
                onClick={() => {
                  addInput();
                  push({ recipientAccount: field.value });
                }}
              >
                Add recipient
              </Button>
              <Spacer />
            </HStack>
          </Box>
        )}
      </FieldArray> */}
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
          onClick={addInput}
        >
          Add recipient
        </Button>
        <Spacer />
      </HStack>
    </FormControl>
  );
}


