import { Text } from '@chakra-ui/react';
import BadgeButton from '@components/BadgeButton';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import totalExecutions from '@utils/totalExecutions';
import { isNil } from 'lodash';

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

export function IncrementAndInterval({ state }: { state: DcaInFormDataAll | WeightedScaleState }) {
  const { initialDeposit, swapAmount, executionIntervalIncrement, executionInterval } = state;

  const executions = totalExecutions(initialDeposit, swapAmount);

  if (!executionIntervalIncrement) {
    const displayExecutionInterval =
      executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];
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
