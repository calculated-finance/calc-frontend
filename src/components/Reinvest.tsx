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
  Center,
  HStack,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { FormNames } from '@hooks/useFormStore';
import { getStrategyInitialDenom, getStrategyName, getStrategyResultingDenom } from '@helpers/strategy';
import useStrategies from '@hooks/useStrategies';
import { Strategy } from '@hooks/useAdminStrategies';
import Icon from '@components/Icon';
import { ArrowRightIcon } from '@fusion-icons/react/interface';
import Spinner from './Spinner';
import DenomIcon from './DenomIcon';
import { StrategyStatusBadge } from './StrategyStatusBadge';

function StrategyOption(props: UseRadioProps & FlexProps & { strategy: Strategy }) {
  const { getInputProps, getRadioProps, htmlProps, getLabelProps } = useRadio(props);
  const { strategy } = props;

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
            <HStack spacing={1}>
              <DenomIcon showTooltip denomName={getStrategyInitialDenom(strategy)} />
              <Icon as={ArrowRightIcon} stroke="grey" />
              <DenomIcon showTooltip denomName={getStrategyResultingDenom(strategy)} />
            </HStack>
            <Text flexGrow={1} fontSize="sm">
              {getStrategyName(strategy)}
            </Text>
            <StrategyStatusBadge strategy={strategy} />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

export default function Reinvest() {
  const [field, meta, helpers] = useField({ name: 'reinvestStrategy' });
  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  const { data, isLoading } = useStrategies();

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Choose another CALC strategy</FormLabel>
      <FormHelperText pb={4}>
        Please note, you must have an active, scheduled or completed strategy. Cancelled strategies do not show up.{' '}
      </FormHelperText>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Stack {...getRootProps} maxH={200} overflow="auto">
          {data?.vaults.map((strategy: Strategy) => {
            const radio = getRadioProps({ value: strategy.id });
            return <StrategyOption key={strategy.id} {...radio} strategy={strategy} />;
          })}
        </Stack>
      )}
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
