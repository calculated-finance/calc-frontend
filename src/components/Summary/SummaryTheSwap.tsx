import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { useDenom } from '@hooks/useDenom/useDenom';
import { SummaryTriggerInfo } from './SummaryTriggerInfo';
import { IncrementAndInterval } from './IncrementAndInterval';

export function SummaryTheSwap({ state, transactionType }: { state: DcaInFormDataAll; transactionType: string }) {
  const { initialDenom, resultingDenom, swapAmount } = state;
  const initialDenomInfo = useDenom(initialDenom);
  const resultingDenomInfo = useDenom(resultingDenom);
  return (
    <Box data-testid="summary-the-swap">
      <Text textStyle="body-xs">The swap</Text>
      <Text lineHeight={8}>
        <SummaryTriggerInfo state={state} transactionType={transactionType} />, CALC will swap{' '}
        <BadgeButton url="customise">
          <Text>
            {String.fromCharCode(8275)} {swapAmount} {initialDenomInfo.name}
          </Text>
          <DenomIcon denomInfo={initialDenomInfo} />
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="assets">
          <Text>{resultingDenomInfo.name}</Text>
          <DenomIcon denomInfo={resultingDenomInfo} />
        </BadgeButton>{' '}
        every <IncrementAndInterval state={state} />.
      </Text>
    </Box>
  );
}
