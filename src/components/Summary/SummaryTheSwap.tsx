import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import totalExecutions from 'src/utils/totalExecutions';
import BadgeButton from '@components/BadgeButton';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { SummaryTriggerInfo } from './SummaryTriggerInfo';

export function SummaryTheSwap({ state, transactionType }: { state: DcaInFormDataAll; transactionType: string }) {
  const { initialDenom, resultingDenom, initialDeposit, swapAmount, executionInterval, executionIntervalIncrement } =
    state;

  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

  const executions = totalExecutions(initialDeposit, swapAmount);
  const displayExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];
  const displayCustomExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][
      executions * executionIntervalIncrement > 1 ? 1 : 0
    ];

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
        every{' '}
        <BadgeButton url="customise">
          <Text>
            {!executionIntervalIncrement
              ? executionIntervalDisplay[executionInterval as ExecutionIntervals][0]
              : `${executionIntervalIncrement} ${displayCustomExecutionInterval}`}
          </Text>
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="customise">
          <Text>
            {!executionIntervalIncrement
              ? `${executions} ${displayExecutionInterval}`
              : swapAmount === initialDeposit
              ? '1 cycle'
              : `${executions * executionIntervalIncrement} ${displayCustomExecutionInterval}`}
          </Text>
        </BadgeButton>{' '}
        .
      </Text>
    </Box>
  );
}
