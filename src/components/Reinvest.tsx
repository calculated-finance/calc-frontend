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
  Link,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  IconButton,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { FormNames } from '@hooks/useFormStore';
import {
  getStrategyInitialDenom,
  getStrategyName,
  getStrategyResultingDenom,
  isStrategyCancelled,
} from '@helpers/strategy';
import useStrategies from '@hooks/useStrategies';
import { Strategy } from '@hooks/useAdminStrategies';
import Icon from '@components/Icon';
import { ArrowRightIcon } from '@fusion-icons/react/interface';
import { useDcaInFormPostPurchase } from '@hooks/useDcaInForm';
import { isEmpty } from 'lodash';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import Spinner from './Spinner';
import DenomIcon from './DenomIcon';
import { StrategyStatusBadge } from './StrategyStatusBadge';

function StrategyOption(props: UseRadioProps & FlexProps & { strategy: Strategy }) {
  const { getInputProps, getRadioProps, htmlProps, getLabelProps } = useRadio(props);
  const { strategy } = props;

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Flex align="center" justify="space-between" gap={3} w="full">
      <Box as="label" {...htmlProps} w="full">
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
      <Popover>
        <PopoverTrigger>
          <IconButton colorScheme="blue" icon={<InfoOutlineIcon />} aria-label="More details" variant="ghost" />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Text fontSize="sm">{getStrategyName(strategy)}</Text>
            <Link isExternal href={`/strategies/details/?id=${strategy.id}`}>
              More details
            </Link>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
}

export function Reinvest({ formName }: { formName: FormNames }) {
  const [field, meta, helpers] = useField({ name: 'reinvestStrategy' });
  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  console.log(meta);

  const { data, isLoading } = useStrategies();
  const { context } = useDcaInFormPostPurchase(formName);

  const filteredStrategies = data?.vaults.filter((strategy: Strategy) => {
    if (getStrategyInitialDenom(strategy) !== context?.resultingDenom) {
      return false;
    }

    if (isStrategyCancelled(strategy)) {
      return false;
    }
    return true;
  });

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
      ) : isEmpty(filteredStrategies) ? (
        <Stack {...getRootProps} maxH={200} overflow="auto">
          <Center>No suitable strategies available</Center>
        </Stack>
      ) : (
        <Stack {...getRootProps} maxH={200} overflow="auto">
          {filteredStrategies?.map((strategy: Strategy) => {
            const radio = getRadioProps({ value: strategy.id.toString() });
            return <StrategyOption key={strategy.id} {...radio} strategy={strategy} />;
          })}
        </Stack>
      )}
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
