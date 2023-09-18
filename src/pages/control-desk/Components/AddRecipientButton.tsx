import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  SimpleGrid,
  Spacer,
  VStack,
} from '@chakra-ui/react';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import { Field, FieldArray, useFormikContext } from 'formik';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import { CtrlFormDataAll } from './ControlDeskForms';

export function RecipientAccountControlDesk() {
  const { values } = useFormikContext<CtrlFormDataAll>();

  // add this to its own component and dynamically create fields with taccess to useField.
  // const [field, meta, helpers] = useField({ name: 'recipientArray' })

  console.log('hi'); // testing

  const { chain } = useChain();

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      {/* <FormControl isInvalid={Boolean(false)}> */}
      <FormLabel>Choose Account</FormLabel>
      <FormHelperText>This wallet address will be the one the funds are sent to.</FormHelperText>
      <SimpleGrid columns={2}>
        <FormHelperText textAlign="left">Recipient:</FormHelperText>
        <FormHelperText textAlign="right">Amount:</FormHelperText>
      </SimpleGrid>
      <FieldArray
        name="recipientArray"
        render={(arrayHelpers) => (
          <Box>
            {/* How does validation work on a 'per field' level. */}
            {values.recipientArray?.map((friend, index) => (
              <VStack>
                {/* <InputGroup key={index} py={1}> */}
                <InputGroup py={1}>
                  <HStack spacing={2} w="full">
                    {index === 0 ? undefined : (
                      <Button
                        size="xs"
                        variant="ghost"
                        width={4}
                        bgColor="abyss.100"
                        h={5}
                        borderRadius={6}
                        onClick={() => arrayHelpers.remove(index)}
                        alignSelf="center"
                      >
                        <Icon as={FiMinusCircle} stroke="brand.200" width={3} height={3} />
                      </Button>
                    )}
                    {/* <FormControl isInvalid={touchedRecip && Boolean(!`errors.recipientArray`)}> */}
                    <Input
                      as={Field}
                      fontSize="sm"
                      placeholder="Address"
                      w="full"
                      name={`recipientArray.${index}.recipientAccount`}
                      component="input"
                      label="Recipient Account"
                    />
                    {/* </FormControl> */}
                    {/* <FormControl isInvalid={touchedRecip && Boolean(!`errors.recipientArray`)}> */}

                    <Input
                      as={Field}
                      fontSize="sm"
                      textAlign="right"
                      placeholder="0"
                      maxW={28}
                      name={`recipientArray.${index}.amount`}
                      label="Amount"
                      type="number"
                    />
                    {/* </FormControl> */}
                  </HStack>
                </InputGroup>
              </VStack>
            ))}
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
                onClick={() => arrayHelpers.push({})}
              >
                Add recipient
              </Button>
              <Spacer />
            </HStack>
          </Box>
        )}
      />
    </FormControl>
  );
}
