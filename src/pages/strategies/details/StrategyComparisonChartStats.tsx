import { Stat, StatNumber, Stack, StatLabel } from '@chakra-ui/react';
import { Strategy } from '@hooks/useStrategies';
import { getStrategyResultingDenom, getTotalReceived } from '@helpers/strategy';
import { getDenomName } from '@utils/getDenomInfo';

export function StrategyComparisonChartStats({ strategy }: { strategy: Strategy }) {
  const resultingDenom = getStrategyResultingDenom(strategy);

  return (
    <Stack spacing={3} pt={6} pl={6}>
      <Stat>
        <StatLabel fontSize="lg">{getDenomName(resultingDenom)} accumulated with this strategy</StatLabel>
        <StatNumber>
          {getTotalReceived(strategy)} {getDenomName(resultingDenom)}
        </StatNumber>
      </Stat>
    </Stack>
  );
}
