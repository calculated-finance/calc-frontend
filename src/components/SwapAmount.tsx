import { Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Spacer, Text, Button } from '@chakra-ui/react';
import { useField } from 'formik';
import totalExecutions from 'src/utils/totalExecutions';
import { DcaInFormDataStep1 } from '@models/DcaInFormData';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { useDenom } from '@hooks/useDenom/useDenom';
import { Strategy } from '@models/Strategy';
import { formatFiat } from '@helpers/format/formatFiat';
import { getStrategyBalance } from '@helpers/strategy';
import { MINIMUM_SWAP_VALUE_IN_USD, featureFlags } from 'src/constants';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { DenomInput } from './DenomInput';
import { TransactionType } from './TransactionType';

export default function SwapAmount({ step1State }: { step1State: DcaInFormDataStep1 }) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'swapAmount' });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });
  const [{ value: executionIntervalIncrement }] = useField({ name: 'executionIntervalIncrement' });
  const { transactionType } = useStrategyInfo();

  const isSell = transactionType === TransactionType.Sell;

  const initialDenom = useDenom(step1State.initialDenom);
  const resultingDenom = useDenom(step1State.resultingDenom);
  const { initialDeposit } = step1State;

  const handleClick = () => {
    helpers.setValue(initialDeposit);
  };

  const executions = totalExecutions(step1State.initialDeposit, field.value);
  const displayExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];
  const displayCustomExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][
    executions * executionIntervalIncrement > 1 ? 1 : 0
    ];

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>
        How much {initialDenom.name} each {isSell ? 'swap' : 'purchase'}?
      </FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The amount you want swapped each purchase for {resultingDenom.name}.</Text>
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
          A total of {executions} swaps will take place over {executions} {displayExecutionInterval}.
        </FormHelperText>
      ) : (
        Boolean(field.value) &&
        !meta.error && (
          <FormHelperText color="brand.200" fontSize="xs">
            A total of {executions} swaps will take place over {executions * executionIntervalIncrement}{' '}
            {displayCustomExecutionInterval}.
          </FormHelperText>
        )
      )}
    </FormControl>
  );
}


export function SwapAmountEdit({ strategy }: { strategy: Strategy }) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'swapAmount' });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });
  const [{ value: executionIntervalIncrement }] = useField({ name: 'executionIntervalIncrement' });
  const [initialDepositField, initialDepositMeta, initialDepositHelpers] = useField({ name: 'initialDeposit' })
  const { transactionType } = useStrategyInfo();

  const isSell = transactionType === TransactionType.Sell;

  const initialDenom = strategy.rawData.deposited_amount.denom
  const resultingDenom = strategy.rawData.received_amount.denom
  const initialDeposit = getStrategyBalance(strategy)

  const step1State = { initialDenom, resultingDenom, initialDeposit } as DcaInFormDataStep1

  const initialDenomInfo = useDenom(step1State.initialDenom);
  const resultingDenomInfo = useDenom(step1State.resultingDenom);
  const { initialDeposit: initialDepositInfo } = step1State;


  const handleClick = () => {
    helpers.setValue(initialDepositInfo);
    initialDepositHelpers.setValue(initialDepositInfo)
  };

  const executions = totalExecutions(initialDepositInfo, field.value);
  const displayExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];
  const displayCustomExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][
    executions * executionIntervalIncrement > 1 ? 1 : 0
    ];



  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>
        How much {initialDenomInfo.name} each {isSell ? 'swap' : 'purchase'}?
      </FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The amount you want swapped each purchase for {resultingDenomInfo.name}.</Text>
          <Spacer />
          <Flex flexDirection="row">
            <Text ml={4} mr={1}>
              Max:
            </Text>
            <Button size="xs" colorScheme="blue" variant="link" cursor="pointer" onClick={handleClick}>
              {step1State.initialDeposit.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 2 }) ?? '-'}
            </Button>
          </Flex>
        </Flex>{' '}
      </FormHelperText>
      <DenomInput denom={initialDenomInfo} onChange={helpers.setValue} {...field} />
      {featureFlags.adjustedMinimumSwapAmountEnabled && (
        <FormHelperText>Swap amount must be greater than {formatFiat(MINIMUM_SWAP_VALUE_IN_USD)}</FormHelperText>
      )}
      <FormErrorMessage>{meta.error}</FormErrorMessage>
      {Boolean(field.value) && !meta.error && !executionIntervalIncrement ? (
        <FormHelperText color="brand.200" fontSize="xs">
          A total of {executions} swaps will take place over {executions} {displayExecutionInterval}.
        </FormHelperText>
      ) : (
        Boolean(field.value) &&
        !meta.error && (
          <FormHelperText color="brand.200" fontSize="xs">
            A total of {executions} swaps will take place over {executions * executionIntervalIncrement}{' '}
            {displayCustomExecutionInterval}.
          </FormHelperText>
        )
      )}
    </FormControl>
  );
}