import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { getSwapRange } from '@helpers/ml/getSwapRange';
import { fromAtomic } from '@utils/getDenomInfo';
import { InitialDenomInfo, ResultingDenomInfo } from '@utils/DenomInfo';
import { ImmediateTriggerInfo } from './SummaryTriggerInfo';

export function SummaryTheSwapDcaPlus({
  initialDenom,
  resultingDenom,
  strategyDuration,
  initialDeposit,
}: {
  initialDenom: InitialDenomInfo;
  resultingDenom: ResultingDenomInfo;
  strategyDuration: number;
  initialDeposit: number;
}) {
  const { name: initialDenomName, minimumSwapAmount } = initialDenom;
  const { name: resultingDenomName } = resultingDenom;

  const swapAmount = getSwapAmountFromDuration(initialDeposit, strategyDuration);

  const { min: minSwap, max: maxSwap } = getSwapRange(swapAmount, strategyDuration, minimumSwapAmount) || {};

  return (
    <Box data-testid="summary-the-swap-dca-plus">
      <Text textStyle="body-xs">The swap</Text>
      <Text lineHeight={8}>
        <ImmediateTriggerInfo />, CALC will swap between{' '}
        <BadgeButton url="customise">
          <Text>
            {minSwap &&
              fromAtomic(initialDenom, minSwap).toLocaleString('en-US', {
                maximumFractionDigits: initialDenom.significantFigures,
              })}{' '}
            {initialDenomName}
          </Text>
          <DenomIcon denomInfo={initialDenom} />
        </BadgeButton>{' '}
        and{' '}
        <BadgeButton url="customise">
          <Text>
            {maxSwap &&
              fromAtomic(initialDenom, maxSwap).toLocaleString('en-US', {
                maximumFractionDigits: initialDenom.significantFigures,
              })}{' '}
            {initialDenomName}
          </Text>
          <DenomIcon denomInfo={initialDenom} />
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="assets">
          <Text>{resultingDenomName}</Text>
          <DenomIcon denomInfo={resultingDenom} />
        </BadgeButton>{' '}
        every day based on market conditions, until the deposit is empty.
      </Text>
    </Box>
  );
}
