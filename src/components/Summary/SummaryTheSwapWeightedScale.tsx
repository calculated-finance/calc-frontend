import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { getSwapRange } from '@helpers/ml/getSwapRange';
import { ImmediateTriggerInfo } from './SummaryTriggerInfo';

export function SummaryTheSwapDcaWeightedScale({ state }: { state: DcaPlusState }) {
  const { initialDenom, resultingDenom, strategyDuration, initialDeposit } = state;

  const { name: initialDenomName, minimumSwapAmount } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

  const swapAmount = getSwapAmountFromDuration(initialDeposit, strategyDuration);

  const { min: minSwap, max: maxSwap } = getSwapRange(swapAmount, strategyDuration, minimumSwapAmount) || {};

  return (
    <Box data-testid="summary-the-swap-dca-plus">
      <Text textStyle="body-xs">The swap</Text>
      <Text lineHeight={8}>
        <ImmediateTriggerInfo />, CALC will swap between{' '}
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
        every day based on market conditions, until the deposit is empty.
      </Text>
    </Box>
  );
}
