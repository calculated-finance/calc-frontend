import { Box, Divider, Stack, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import { useConfirmForm } from 'src/hooks/useDcaInForm';
import totalExecutions from 'src/utils/totalExecutions';
import { useQuery } from '@tanstack/react-query';
import BadgeButton from '@components/BadgeButton';
import DcaDiagram from '@components/DcaDiagram';
import { StartImmediatelyValues } from '../../../../models/StartImmediatelyValues';
import executionIntervalDisplay from '../../../../helpers/executionIntervalDisplay';
import TriggerTypes from '../../../../models/TriggerTypes';

export default function Summary() {
  const { state } = useConfirmForm();

  // instead of returning any empty state on error, we could throw a validation error and catch it to display the
  // invalid data message, along with missing field info.
  if (!state) {
    return null;
  }

  const {
    initialDenom,
    resultingDenom,
    initialDeposit,
    swapAmount,
    startDate,
    executionInterval,
    purchaseTime,
    startImmediately,
    triggerType,
    startPrice,
    recipientAccount,
  } = state;

  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

  const formattedDate = startDate?.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const zone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];

  const formattedTime = purchaseTime || '00:00';

  let triggerInfo;
  if (startImmediately === StartImmediatelyValues.Yes) {
    triggerInfo = (
      <>
        Starting{' '}
        <BadgeButton url="customise">
          <Text>Immediately</Text>
        </BadgeButton>
      </>
    );
  } else if (triggerType === TriggerTypes.Date) {
    triggerInfo = (
      <>
        Starting{' '}
        <BadgeButton url="customise">
          <Text>{formattedDate}</Text>
        </BadgeButton>
        {Boolean(purchaseTime) && (
          <>
            {' '}
            at{' '}
            <BadgeButton url="customise">
              <Text>
                {formattedTime} {zone}
              </Text>
            </BadgeButton>
          </>
        )}
      </>
    );
  } else {
    triggerInfo = (
      <>
        when{' '}
        <BadgeButton url="customise">
          <Text>{resultingDenomName}</Text>
          <DenomIcon denomName={resultingDenom} />
          <Text>=</Text>
          <Text>
            {startPrice} {initialDenomName}
          </Text>
          <DenomIcon denomName={initialDenom} />
        </BadgeButton>
      </>
    );
  }

  const executions = totalExecutions(initialDeposit, swapAmount);
  const displayExecutionInterval = executionIntervalDisplay[executionInterval][executions > 1 ? 1 : 0];
  return (
    <Stack spacing={4}>
      <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={initialDeposit} />
      <Divider />
      <Box>
        <Text textStyle="body-xs">The swap</Text>
        <Text lineHeight={8}>
          {triggerInfo}, CALC will swap{' '}
          <BadgeButton url="customise">
            <Text>
              ~{swapAmount} {initialDenomName}
            </Text>
            <DenomIcon denomName={initialDenom} />
          </BadgeButton>{' '}
          for{' '}
          <BadgeButton url="assets">
            <Text>{resultingDenomName}</Text>
            <DenomIcon denomName={resultingDenom} />
          </BadgeButton>{' '}
          for{' '}
          <BadgeButton url="customise">
            <Text>
              {executions} {displayExecutionInterval}
            </Text>
          </BadgeButton>{' '}
          .
        </Text>
      </Box>
      {recipientAccount && (
        <Box>
          <Text textStyle="body-xs">After each swap</Text>
          <Text lineHeight={8}>
            After each swap, CALC will send the funds to{' '}
            <BadgeButton url="post-purchase">
              <Text>{recipientAccount}</Text>
            </BadgeButton>
          </Text>
        </Box>
      )}
    </Stack>
  );
}
