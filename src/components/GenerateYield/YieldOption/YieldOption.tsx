import { Box, FlexProps, Text, UseRadioProps, useRadio, Grid, GridItem } from '@chakra-ui/react';

export function YieldOption({
  icon,
  description,
  apr,
  ...props
}: UseRadioProps & FlexProps & { icon: React.ReactNode; description: string; apr: number }) {
  const { getInputProps, getRadioProps, htmlProps, getLabelProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" {...htmlProps}>
      <input {...input} />
      <Box
        {...checkbox}
        borderWidth={1}
        py={4}
        px={3}
        borderRadius="2xl"
        w="full"
        _hover={{ borderColor: 'grey', cursor: 'pointer' }}
        _checked={{
          borderColor: 'brand.200',
        }}
        _focusVisible={{
          boxShadow: 'outline',
        }}
        _disabled={{
          opacity: 0.5,
          cursor: 'not-allowed',
        }}
      >
        <Box {...getLabelProps()}>
          <Grid templateColumns="repeat(8, 1fr)">
            <GridItem colSpan={1} verticalAlign="center" textAlign="center">
              <Box mt="px">{icon}</Box>
            </GridItem>
            <GridItem colSpan={5}>
              <Text fontSize="sm">{description}</Text>
            </GridItem>
            <GridItem colSpan={2} textAlign="right">
              <Text>~{Number((apr * 100).toFixed(2))}%</Text>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
