import { Box, Divider, Stack, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import { FormNames, useConfirmForm } from 'src/hooks/useDcaInForm';
import totalExecutions from 'src/utils/totalExecutions';
import BadgeButton from '@components/BadgeButton';
import DcaDiagram from '@components/DcaDiagram';
import { initialValues } from '@models/DcaInFormData';
import { StartImmediatelyValues } from '../../../../models/StartImmediatelyValues';
import executionIntervalDisplay from '../../../../helpers/executionIntervalDisplay';
import TriggerTypes from '../../../../models/TriggerTypes';

export default function Summary() {
  const { state } = useConfirmForm(FormNames.DcaOut);

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
    slippageTolerance,
    priceThresholdValue,
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
        Starting when{' '}
        <BadgeButton url="customise">
          <Text>{initialDenomName}</Text>
          <DenomIcon denomName={initialDenom} />
          <Text>=</Text>
          <Text>
            {startPrice} {resultingDenomName}
          </Text>
          <DenomIcon denomName={resultingDenom} />
        </BadgeButton>
      </>
    );
  }
  const showSlippage =
    slippageTolerance !== undefined &&
    slippageTolerance !== null &&
    slippageTolerance !== initialValues.slippageTolerance;

  const showWhileSwapping = showSlippage || priceThresholdValue;

  const executions = totalExecutions(initialDeposit, swapAmount);
  const displayExecutionInterval = executionIntervalDisplay[executionInterval][executions > 1 ? 1 : 0];
  return (
    <Stack spacing={4}>
      <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={initialDeposit} />
      <Divider />
      <Box data-testid="summary-your-deposit">
        <Text textStyle="body-xs">Your deposit</Text>
        <Text lineHeight={8}>
          I deposit{' '}
          <BadgeButton url="assets">
            <Text>
              {initialDeposit} {initialDenomName}
            </Text>
            <DenomIcon denomName={initialDenom} />{' '}
          </BadgeButton>{' '}
          Into the CALC DCA Out vault.
        </Text>
      </Box>
      <Box data-testid="summary-the-swap">
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
          every{' '}
          <BadgeButton url="customise">
            <Text textTransform="capitalize">{executionIntervalDisplay[executionInterval][0]}</Text>
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
      {showWhileSwapping && (
        <Box data-testid="summary-the-swap">
          <Text textStyle="body-xs">While swapping</Text>
          <Text lineHeight={8}>
            If the{' '}
            {Boolean(priceThresholdValue) && (
              <>
                <BadgeButton url="customise">
                  <Text>{initialDenomName}</Text>
                  <DenomIcon denomName={initialDenom} />
                </BadgeButton>{' '}
                price is lower than
                <BadgeButton url="customise">
                  <Text>
                    ~{priceThresholdValue} {resultingDenomName}
                  </Text>
                  <DenomIcon denomName={resultingDenom} />
                </BadgeButton>{' '}
              </>
            )}
            {showSlippage && (
              <>
                {Boolean(priceThresholdValue) && 'or '}
                slippage exceeds{' '}
                <BadgeButton url="customise">
                  <Text>{slippageTolerance}%</Text>
                </BadgeButton>
                {', '}
              </>
            )}
            CALC will not swap.
          </Text>
        </Box>
      )}
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
