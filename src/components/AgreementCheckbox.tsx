import { Button, chakra, Flex, FormControl, FormErrorMessage, HStack, Text, useCheckbox } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { useField, useFormikContext } from 'formik';
import { FiCheck } from 'react-icons/fi';

type AgreementCheckboxProps = {
  onOpenTerms?: () => void;
};

export function AgreementCheckbox({ onOpenTerms }: AgreementCheckboxProps) {
  const [field, meta] = useField('acceptedAgreement');
  const { isSubmitting } = useFormikContext();

  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox({
    ...field,
    isDisabled: isSubmitting,
  });

  return (
    <FormControl isInvalid={meta.touched && !!meta.error} isDisabled={isSubmitting}>
      <HStack spacing={0}>
        <Text as="span" textStyle="body-xs" {...getLabelProps()} mr={1}>
          I have read and agree to be bound by the{' '}
          {onOpenTerms ? (
            <Button
              textDecoration="underline"
              fontWeight="normal"
              size="xs"
              display="inline-flex"
              colorScheme="blue"
              variant="unstyled"
              onClick={onOpenTerms}
            />
          ) : (
            'CALC Terms & Conditions.'
          )}
        </Text>

        <chakra.label pl={1} display="flex" flexDirection="row" alignItems="center" cursor="pointer" {...htmlProps}>
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
  );
}
