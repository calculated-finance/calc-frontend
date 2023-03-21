import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';

export function SummaryBenchmark({ state }: { state: DcaPlusState }) {
  const { initialDenom, resultingDenom, initialDeposit, strategyDuration } = state;

  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

  const swapAmount = Number(getSwapAmountFromDuration(initialDeposit, strategyDuration).toFixed(3));

  return (
    <Box data-testid="summary-benchmark">
      <Text textStyle="body-xs">Benchmark</Text>
      <Text lineHeight={8}>
        The DCA+ performance will be benchmarked against a daily swap of{' '}
        <BadgeButton url="customise">
          <Text>
            {swapAmount} {initialDenomName}
          </Text>
          <DenomIcon denomName={initialDenom} />{' '}
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="assets">
          <Text>{resultingDenomName}</Text>
          <DenomIcon denomName={resultingDenom} />{' '}
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="customise">
          <Text>{strategyDuration} days</Text>
        </BadgeButton>
        .
      </Text>
    </Box>
  );
}
