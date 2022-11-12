import { chakra, Flex, FormControl, FormErrorMessage, HStack, useCheckbox } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { useField, useFormikContext } from 'formik';
import { FiCheck } from 'react-icons/fi';
import { ChildrenProp } from 'src/helpers/ChildrenProp';

export function AgreementCheckbox({ children }: ChildrenProp) {
  const [field, meta] = useField('acceptedAgreement');
  const { isSubmitting } = useFormikContext();

  const { state, getCheckboxProps, getInputProps, htmlProps } = useCheckbox({
    ...field,
    isDisabled: isSubmitting,
  });

  return (
    <Flex>
      <FormControl isInvalid={meta.touched && !!meta.error} isDisabled={isSubmitting}>
        <HStack spacing={2}>
          {children}
          <chakra.label
            data-testid="agreement-checkbox"
            pl={1}
            display="flex"
            flexDirection="row"
            alignItems="center"
            cursor="pointer"
            {...htmlProps}
          >
            <input {...getInputProps()} hidden />
            <Flex
              alignItems="center"
              justifyContent="center"
              border="1px solid"
              borderRadius="sm"
              borderColor="white"
              bg={state.isChecked ? 'brand.200' : 'none'}
              w={4}
              h={4}
              {...getCheckboxProps()}
            >
              {state.isChecked && <Icon as={FiCheck} w={3} h={3} />}
            </Flex>
          </chakra.label>
        </HStack>

        <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
      </FormControl>
    </Flex>
  );
}
