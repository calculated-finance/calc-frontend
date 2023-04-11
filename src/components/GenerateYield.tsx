import {
  Box,
  Flex,
  FlexProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Stack,
  Text,
  UseRadioProps,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';
import { TestnetDenoms } from '@models/Denom';
import { useField } from 'formik';
import DenomIcon from './DenomIcon';

type YieldPool = {
  id: string;
  name: string;
  denomIn: TestnetDenoms;
  denomOut: TestnetDenoms;
  apr: number;
};

const yieldOptionData: YieldPool[] = [
  {
    id: '1',
    name: 'ATOM / OSMO Single sided LP (1 day)',
    denomIn: TestnetDenoms.AXL,
    denomOut: TestnetDenoms.OSMO,
    apr: 0.08,
  },
  {
    id: '2',
    name: 'ATOM / OSMO Single sided LP (7 days)',
    denomIn: TestnetDenoms.AXL,
    denomOut: TestnetDenoms.OSMO,
    apr: 0.1,
  },
  {
    id: '3',
    name: 'ATOM / OSMO Single sided LP (14 days)',
    denomIn: TestnetDenoms.AXL,
    denomOut: TestnetDenoms.OSMO,
    apr: 0.12,
  },
];

function YieldOption(props: UseRadioProps & FlexProps & { pool: YieldPool }) {
  const { getInputProps, getRadioProps, htmlProps, getLabelProps } = useRadio(props);
  const { pool } = props;

  const input = getInputProps();
  const checkbox = getRadioProps();
  return (
    <Box as="label" {...htmlProps}>
      <input {...input} />
      <Box
        {...checkbox}
        borderWidth={1}
        py={4}
        px={6}
        borderRadius="2xl"
        w="full"
        _hover={{ borderColor: 'grey', cursor: 'pointer' }}
        _checked={{
          borderColor: 'brand.200',
        }}
        _focusVisible={{
          boxShadow: 'outline',
        }}
      >
        <Box {...getLabelProps()}>
          <Flex justify="space-between" align="center" gap={4}>
            <Flex position="relative" w={8} h={5}>
              <Flex as="span" position="absolute" right="px">
                <DenomIcon denomName={pool.denomIn} size={5} />
              </Flex>
              <Flex as="span" position="absolute" left="px">
                <DenomIcon denomName={pool.denomOut} size={5} />
              </Flex>
            </Flex>
            <Text flexGrow={1} fontSize="sm">
              {pool.name}
            </Text>
            <Text>{pool.apr * 100}%</Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

export default function GenerateYield() {
  const [field, meta, helpers] = useField({ name: 'yieldOption' });
  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });
  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Choose Strategy</FormLabel>
      <FormHelperText pb={4}>CALC uses AuthZ to deploy the post swap capital on your behalf.</FormHelperText>
      <Stack {...getRootProps}>
        {yieldOptionData.map((option) => {
          const radio = getRadioProps({ value: option.id });
          return <YieldOption key={option.id} {...radio} pool={option} />;
        })}
      </Stack>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
