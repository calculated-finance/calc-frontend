import { Box, Text, useRadio, UseRadioProps } from '@chakra-ui/react';
import { ChildrenProp } from 'src/helpers/ChildrenProp';

export default function RadioCard(props: UseRadioProps & ChildrenProp) {
  const { children } = props;
  const { getInputProps, getCheckboxProps, htmlProps, getLabelProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" {...htmlProps}>
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        w="max-content"
        px={2}
        _checked={{
          bg: 'blue.200',
          color: 'navy',
          borderRadius: '2xl',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
      >
        <Text {...getLabelProps()}>{children}</Text>
      </Box>
    </Box>
  );
}
