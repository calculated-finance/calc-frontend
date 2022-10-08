import { Box, Divider, Stack, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import { useConfirmForm } from 'src/hooks/useDcaInForm';
import totalExecutions from 'src/utils/totalExecutions';
import { StartImmediatelyValues } from '../step2/StartImmediatelyValues';
import DcaInDiagram from './DcaInDiagram';
import executionIntervalDisplay from './executionIntervalDisplay';
import BadgeButton from './BadgeButton';
import TriggerTypes from '../step2/TriggerTypes';

export default function Summary() {
  const { state } = useConfirmForm();

  // instead of returning any empty state on error, we could throw a validation error and catch it to display the
  // invalid data message, along with missing field info.
  if (!state) {
    return null;
  }

  const {
    quoteDenom,
    baseDenom,
    initialDeposit,
    swapAmount,
    startDate,
    executionInterval,
    purchaseTime,
    startImmediately,
    triggerType,
    startPrice,
  } = state;

  const { name: quoteDenomName } = getDenomInfo(quoteDenom);
  const { name: baseDenomName } = getDenomInfo(baseDenom);

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
        <BadgeButton>
          <Text>Immediately</Text>
        </BadgeButton>
      </>
    );
  } else if (triggerType === TriggerTypes.Date) {
    triggerInfo = (
      <>
        Starting{' '}
        <BadgeButton>
          <Text>{formattedDate}</Text>
        </BadgeButton>
        {Boolean(purchaseTime) && (
          <>
            {' '}
            at{' '}
            <BadgeButton>
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
        <BadgeButton>
          <Text>{baseDenomName}</Text>
          <DenomIcon denomName={baseDenom} />
          <Text>=</Text>
          <Text>
            {startPrice} {quoteDenomName}
          </Text>
          <DenomIcon denomName={quoteDenom} />
        </BadgeButton>
      </>
    );
  }

  const executions = totalExecutions(initialDeposit, swapAmount);
  const displayExecutionInterval = executionIntervalDisplay[executionInterval][executions > 1 ? 1 : 0];
  return (
    <Stack spacing={4}>
      <DcaInDiagram quoteDenom={quoteDenom} baseDenom={baseDenom} initialDeposit={initialDeposit} />
      <Divider />
      <Box>
        <Text textStyle="body-xs">Your deposit</Text>
        <Text lineHeight={8}>
          I deposit{' '}
          <BadgeButton>
            <Text>
              {initialDeposit} {quoteDenomName}
            </Text>
            <DenomIcon denomName={quoteDenom} />{' '}
          </BadgeButton>{' '}
          Into the CALC DCA In vault.
        </Text>
      </Box>
      <Box>
        <Text textStyle="body-xs">The swap</Text>
        <Text lineHeight={8}>
          {triggerInfo}, CALC will swap{' '}
          <BadgeButton>
            <Text>
              ~{swapAmount} {quoteDenomName}
            </Text>
            <DenomIcon denomName={quoteDenom} />
          </BadgeButton>{' '}
          for{' '}
          <BadgeButton>
            <Text>{baseDenomName}</Text>
            <DenomIcon denomName={baseDenom} />
          </BadgeButton>{' '}
          for{' '}
          <BadgeButton>
            <Text>
              {executions} {displayExecutionInterval}
            </Text>
          </BadgeButton>{' '}
          .
        </Text>
      </Box>
    </Stack>
  );
}
