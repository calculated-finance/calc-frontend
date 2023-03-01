import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import { SummaryTriggerInfo } from './SummaryTriggerInfo';

export function SummaryTheSwapDcaPlus({ state }: any) {
  const { initialDenom, resultingDenom } = state;

  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

  const minSwap = 0.1;
  const maxSwap = 1000;

  return (
    <Box data-testid="summary-the-swap-dca-plus">
      <Text textStyle="body-xs">The swap</Text>
      <Text lineHeight={8}>
        <SummaryTriggerInfo state={state} />, CALC will swap between{' '}
        <BadgeButton url="customise">
          <Text>
            {minSwap} {initialDenomName}
          </Text>
          <DenomIcon denomName={initialDenom} />
        </BadgeButton>{' '}
        and{' '}
        <BadgeButton url="customise">
          <Text>
            {maxSwap} {initialDenomName}
          </Text>
          <DenomIcon denomName={initialDenom} />
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="assets">
          <Text>{resultingDenomName}</Text>
          <DenomIcon denomName={resultingDenom} />
        </BadgeButton>{' '}
        every Day based on market conditions, until the deposit is empty.
      </Text>
    </Box>
  );
}
