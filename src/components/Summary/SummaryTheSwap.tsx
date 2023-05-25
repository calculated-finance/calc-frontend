import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import totalExecutions from 'src/utils/totalExecutions';
import BadgeButton from '@components/BadgeButton';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { isNil } from 'lodash';
import { SummaryTriggerInfo } from './SummaryTriggerInfo';

function customExecutionInterval(
  increment: number | null | undefined,
  interval: ExecutionIntervals,
  executions: number,
) {
  if (!isNil(increment) && increment > 0) {
    const displayCustomExecutionInterval =
      executionIntervalDisplay[interval as ExecutionIntervals][executions * increment > 1 ? 1 : 0];
    return displayCustomExecutionInterval;
  }
  return null;
}

function IncrementAndInterval({ state }: { state: DcaInFormDataAll }) {
  const { initialDeposit, swapAmount, executionIntervalIncrement, executionInterval } = state;

  const executions = totalExecutions(initialDeposit, swapAmount);
  const displayExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];

  if (!executionIntervalIncrement) {
    return (
      <>
        <BadgeButton url="customise">
          <Text>{executionIntervalDisplay[executionInterval as ExecutionIntervals][0]}</Text>
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="customise">
          <Text>
            {executions} {displayExecutionInterval}
          </Text>
        </BadgeButton>{' '}
      </>
    );
  }

  const customInterval = customExecutionInterval(executionIntervalIncrement, executionInterval, executions);

  return (
    <>
      <BadgeButton url="customise">
        <Text>
          {executionIntervalIncrement} {customInterval}
        </Text>
      </BadgeButton>{' '}
      for{' '}
      <BadgeButton url="customise">
        <Text>
          {swapAmount === initialDeposit ? '1 cycle' : `${executions * executionIntervalIncrement} ${customInterval}`}
        </Text>
      </BadgeButton>{' '}
    </>
  );
}

export function SummaryTheSwap({ state, transactionType }: { state: DcaInFormDataAll; transactionType: string }) {
  const { initialDenom, resultingDenom, swapAmount } = state;
  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

  return (
    <Box data-testid="summary-the-swap">
      <Text textStyle="body-xs">The swap</Text>
      <Text lineHeight={8}>
        <SummaryTriggerInfo state={state} transactionType={transactionType} />, CALC will swap{' '}
        <BadgeButton url="customise">
          <Text>
            {String.fromCharCode(8275)} {swapAmount} {initialDenomName}
          </Text>
          <DenomIcon denomName={initialDenom} />
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="assets">
          <Text>{resultingDenomName}</Text>
          <DenomIcon denomName={resultingDenom} />
        </BadgeButton>{' '}
        every <IncrementAndInterval state={state} />.
      </Text>
    </Box>
  );
}
