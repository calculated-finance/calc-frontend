import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Icon,
  Image,
  Spacer,
  Text,
  chakra,
  useCheckbox,
} from '@chakra-ui/react';
import { useAdmin } from '@hooks/useAdmin';
import { useField } from 'formik';
import { FiCheck } from 'react-icons/fi';

export default function AutoCompoundStakingRewards({ enabled }: { enabled: boolean }) {
  const [field, meta] = useField({ name: 'autoCompoundStakingRewards' });

  const { state, getCheckboxProps, getInputProps, htmlProps } = useCheckbox({
    isChecked: field.value,
    ...field,
  });

  const { isAdmin } = useAdmin();

  return isAdmin && enabled ? (
    <Flex>
      <FormControl isInvalid={meta.touched && !!meta.error}>
        <HStack spacing={2}>
          <Text fontSize="sm">Auto-compound my staking rewards with</Text>
          <Image src="/images/yieldmos.svg" />
          <Spacer />
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
        <FormHelperText color="brand.200" fontSize="xs">
          Please note, any currently staked tokens with this validator will also be auto-compounded by Yieldmos.
        </FormHelperText>
        <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
      </FormControl>
    </Flex>
  ) : null;
}
