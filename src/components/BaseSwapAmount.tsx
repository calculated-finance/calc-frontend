import { Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Spacer, Text, Button } from '@chakra-ui/react';
import { useField } from 'formik';
import totalExecutions from 'src/utils/totalExecutions';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { MINIMUM_SWAP_VALUE_IN_USD, featureFlags } from 'src/constants';
import { formatFiat } from '@helpers/format/formatFiat';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { DenomInfo } from '@utils/DenomInfo';
import { DenomInput } from './DenomInput';

export default function BaseSwapAmount({
  initialDenom,
  initialDeposit,
}: {
  initialDenom: DenomInfo;
  initialDeposit: number;
}) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'swapAmount' });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });
  const [{ value: executionIntervalIncrement }] = useField({ name: 'executionIntervalIncrement' });

  const handleClick = () => {
    helpers.setValue(initialDeposit);
  };

  const executions = totalExecutions(initialDeposit, field.value);
  const displayExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];

  const displayCustomExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][
      executions * executionIntervalIncrement > 1 ? 1 : 0
    ];

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Set your base {initialDenom.name} swap amount</FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The base amount you want swapped each interval.</Text>
          <Spacer />
          <Flex flexDirection="row">
            <Text ml={4} mr={1}>
              Max:
            </Text>
            <Button size="xs" colorScheme="blue" variant="link" cursor="pointer" onClick={handleClick}>
              {initialDeposit.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 2 }) ?? '-'}
            </Button>
          </Flex>
        </Flex>{' '}
      </FormHelperText>
      <DenomInput denom={initialDenom} onChange={helpers.setValue} {...field} />
      {featureFlags.adjustedMinimumSwapAmountEnabled && (
        <FormHelperText>Swap amount must be greater than {formatFiat(MINIMUM_SWAP_VALUE_IN_USD)}</FormHelperText>
      )}

      <FormErrorMessage>{meta.error}</FormErrorMessage>
      {Boolean(field.value) && !meta.error && !executionIntervalIncrement ? (
        <FormHelperText color="brand.200" fontSize="xs">
          With no price change, {executions} swaps over {executions} {displayExecutionInterval}.
        </FormHelperText>
      ) : (
        Boolean(field.value) &&
        !meta.error && (
          <FormHelperText color="brand.200" fontSize="xs">
            With no price change, {executions} swaps over {executions * executionIntervalIncrement}{' '}
            {displayCustomExecutionInterval}.
          </FormHelperText>
        )
      )}
    </FormControl>
  );
}
