import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { SummaryTriggerInfo } from './SummaryTriggerInfo';
import { IncrementAndInterval } from './IncrementAndInterval';

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
