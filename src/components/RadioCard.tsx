import { Box, Text, useRadio, UseRadioProps, FlexProps, Tooltip } from '@chakra-ui/react';
import { ChildrenProp } from '@helpers/ChildrenProp';

export default function RadioCard(props: UseRadioProps & ChildrenProp & FlexProps & { disabledMessage?: string }) {
  const { children, borderRadius, isDisabled, disabledMessage } = props;
  const { getInputProps, getCheckboxProps, htmlProps, getLabelProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Tooltip label={isDisabled ? disabledMessage : ''}>
      <Box as="label" {...htmlProps}>
        <input {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          px={2}
          _checked={{
            bg: 'blue.200',
            color: 'navy',
          }}
          borderRadius={borderRadius || '2xl'}
          _focus={{
            boxShadow: 'outline',
          }}
          _disabled={{
            opacity: 0.4,
            cursor: 'not-allowed',
          }}
        >
          <Text {...getLabelProps()}>{children}</Text>
        </Box>
      </Box>
    </Tooltip>
  );
}
