import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { getSwapRange } from '@helpers/ml/getSwapRange';
import { SummaryTriggerInfo } from './SummaryTriggerInfo';

export function SummaryTheSwapDcaPlus({ state }: { state: DcaPlusState }) {
  const { initialDenom, resultingDenom, strategyDuration, initialDeposit } = state;

  const { name: initialDenomName, minimumSwapAmount } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

  const swapAmount = getSwapAmountFromDuration(initialDeposit, strategyDuration);

  const { min, max } = getSwapRange(swapAmount, strategyDuration) || {};

  const minSwap = min && Number(Math.max(minimumSwapAmount, min).toFixed(3));
  const maxSwap = max && Number(max.toFixed(3));

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
