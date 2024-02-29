import { Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Spacer, Text, Button } from '@chakra-ui/react';
import { useField } from 'formik';
import totalExecutions from 'src/utils/totalExecutions';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { formatFiat } from '@helpers/format/formatFiat';
import { getChainMinimumSwapValue } from '@helpers/chains';
import { useChainId } from '@hooks/useChainId';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { fromAtomic, toAtomic } from '@utils/getDenomInfo';
import { DenomInfo } from '@utils/DenomInfo';
import { DenomInput } from './DenomInput';

export default function BaseSwapAmount({
  initialDenom,
  initialDeposit,
}: {
  initialDenom: DenomInfo;
  initialDeposit: number;
}) {
  const { chainId } = useChainId();
  const [{ onChange, value: swapAmount, ...field }, swapAmountMeta, swapAmountHelpers] = useField({
    name: 'swapAmount',
  });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });
  const [{ value: executionIntervalIncrement }] = useField({ name: 'executionIntervalIncrement' });

  const executions = totalExecutions(initialDeposit, swapAmount);
  const displayExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];

  const displayCustomExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][
      executions * executionIntervalIncrement > 1 ? 1 : 0
    ];

  return (
    <FormControl isInvalid={Boolean(swapAmountMeta.touched && swapAmountMeta.error)}>
      <FormLabel>Set your base {initialDenom.name} swap amount</FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The base amount you want swapped each interval.</Text>
          <Spacer />
          <Flex flexDirection="row">
            <Text ml={4} mr={1}>
              Max:
            </Text>
            <Button
              size="xs"
              colorScheme="blue"
              variant="link"
              cursor="pointer"
              onClick={() => swapAmountHelpers.setValue(initialDeposit)}
            >
              {fromAtomic(initialDenom, initialDeposit).toLocaleString('en-US', {
                maximumFractionDigits: initialDenom.significantFigures,
                minimumFractionDigits: 2,
              }) ?? '-'}
            </Button>
          </Flex>
        </Flex>{' '}
      </FormHelperText>
      <DenomInput
        denom={initialDenom}
        value={swapAmount && fromAtomic(initialDenom, swapAmount)}
        onChange={(input) => swapAmountHelpers.setValue(input && toAtomic(initialDenom, Number(input)))}
        {...field}
      />
      <FormHelperText>Swap amount must be greater than {formatFiat(getChainMinimumSwapValue(chainId))}</FormHelperText>

      <FormErrorMessage>{swapAmountMeta.error}</FormErrorMessage>
      {Boolean(swapAmount) && !swapAmountMeta.error && !executionIntervalIncrement ? (
        <FormHelperText color="brand.200" fontSize="xs">
          With no price change, {executions} swaps over {executions} {displayExecutionInterval}.
        </FormHelperText>
      ) : (
        Boolean(swapAmount) &&
        !swapAmountMeta.error && (
          <FormHelperText color="brand.200" fontSize="xs">
            With no price change, {executions} swaps over {executions * executionIntervalIncrement}{' '}
            {displayCustomExecutionInterval}.
          </FormHelperText>
        )
      )}
    </FormControl>
  );
}
