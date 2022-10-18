import {
  chakra,
  Flex,
  FormControl,
  FormErrorMessage, Text,
  useCheckbox
} from '@chakra-ui/react';
import Icon from '@components/Icon';
import { useField } from 'formik';
import { FiCheck } from 'react-icons/fi';

export function AgreementCheckbox() {
  const [field, meta] = useField('acceptedAgreement');
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(field);

  return (
    <FormControl isInvalid={meta.touched && !!meta.error}>
      <chakra.label display="flex" flexDirection="row" alignItems="center" cursor="pointer" {...htmlProps}>
        <Text textStyle="body-xs" {...getLabelProps()} mr={2}>
          I have read and agree to be bound by the CALC Terms & Conditions.
        </Text>

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
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
