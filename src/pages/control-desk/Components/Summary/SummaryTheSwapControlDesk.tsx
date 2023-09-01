import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { useDenom } from '@hooks/useDenom/useDenom';
import YesNoValues from '@models/YesNoValues';
import { CtrlFormDataAll } from '../ControlDeskForms';

export function SummaryTheSwapControlDesk({ state, transactionType }: { state: CtrlFormDataAll; transactionType: string }) {
  const { initialDenom, resultingDenom, calcCalculatedSwapsEnabled } = state;
  const initialDenomInfo = useDenom(initialDenom);
  const resultingDenomInfo = useDenom(resultingDenom);
  return (
    <Box data-testid="summary-the-swap">
      <Text textStyle="body-xs">The swap</Text>
      <Text lineHeight={8}>
        Starting immediately, CALC will swap the amount of
        <BadgeButton url="customise">
          <Text>
            {String.fromCharCode(8275)} {'XXXX'} - {'XXXX'} {initialDenomInfo.name}
          </Text>
          <DenomIcon denomInfo={initialDenomInfo} />
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="assets">
          <Text>{resultingDenomInfo.name}</Text>
          <DenomIcon denomInfo={resultingDenomInfo} />
        </BadgeButton>{' '}
        every{' '}
        {calcCalculatedSwapsEnabled === YesNoValues.Yes ? '[DETAILS ABOUT CALCS AUTO SWAP]' :
          //  <IncrementAndInterval state={state} />
          'Custom Interval Increment details'
        }
        .
      </Text>
    </Box>
  );
}
