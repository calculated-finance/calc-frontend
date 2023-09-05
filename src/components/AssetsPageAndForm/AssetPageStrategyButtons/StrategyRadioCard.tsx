import { Box, Center, HStack, UseRadioProps, useRadio } from '@chakra-ui/react';
import { ChildrenProp } from '@helpers/ChildrenProp';

export function StrategyRadioCard({
  buttonClicked,
  ...props
}: { buttonClicked: string | undefined } & UseRadioProps & ChildrenProp) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth={1}
        borderRadius="lg"
        textColor="slategrey"
        borderColor="slategrey"
        _checked={{
          color: 'brand.200',
          borderColor: 'brand.200',
        }}
        _hover={{ bgColor: 'transparent' }}
        fontSize={{ base: '10px', sm: '12px' }}
        width={{ base: '108px', sm: 32 }}
      >
        <Center>
          <HStack>
            <Box> {props.children}</Box>
          </HStack>
        </Center>
      </Box>
    </Box>
  );
}
