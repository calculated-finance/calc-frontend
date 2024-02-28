import { Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Spacer, Text, Button } from '@chakra-ui/react';
import { useField } from 'formik';
import totalExecutions from 'src/utils/totalExecutions';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { DenomInfo } from '@utils/DenomInfo';
import { formatFiat } from '@helpers/format/formatFiat';
import { MINIMUM_SWAP_VALUE_IN_USD } from 'src/constants';
import { DenomInput } from './DenomInput';
import { TransactionType } from './TransactionType';
import { fromAtomic, toAtomic } from '@utils/getDenomInfo';

export default function SwapAmount({
  isEdit,
  initialDenom,
  resultingDenom,
  initialDeposit,
  transactionType,
}: {
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  initialDeposit: number;
  isEdit: boolean;
  transactionType: TransactionType;
}) {
  const [{ onChange, value: swapAmount, ...field }, swapAmountMeta, swapAmountHelpers] = useField({
    name: 'swapAmount',
  });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });
  const [{ value: executionIntervalIncrement }] = useField({ name: 'executionIntervalIncrement' });

  const isSell = transactionType === TransactionType.Sell;

  const executions = totalExecutions(initialDeposit, swapAmount);

  const displayExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];

  const displayCustomExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][
      executions * executionIntervalIncrement > 1 ? 1 : 0
    ];

  return (
    <FormControl isInvalid={Boolean(swapAmountMeta.touched && swapAmountMeta.error)}>
      <FormLabel>
        How much {initialDenom.name} each {isSell ? 'swap' : 'purchase'}?
      </FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The amount you want swapped each purchase for {resultingDenom.name}.</Text>
          <Spacer />
          <Flex flexDirection="row">
            <Text ml={4} mr={1}>
              {isEdit ? 'Balance:' : 'Max:'}
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
      <FormHelperText>Swap amount must be greater than {formatFiat(MINIMUM_SWAP_VALUE_IN_USD)}</FormHelperText>
      <FormErrorMessage>{swapAmountMeta.error}</FormErrorMessage>
      {Boolean(swapAmount) && !swapAmountMeta.error && !executionIntervalIncrement ? (
        <FormHelperText color="brand.200" fontSize="xs">
          A total of {executions} swaps will take place over {executions} {displayExecutionInterval}.
        </FormHelperText>
      ) : (
        Boolean(swapAmount) &&
        !swapAmountMeta.error && (
          <FormHelperText color="brand.200" fontSize="xs">
            A total of {executions} swaps will take place over {executions * executionIntervalIncrement}{' '}
            {displayCustomExecutionInterval}.
          </FormHelperText>
        )
      )}
    </FormControl>
  );
}
