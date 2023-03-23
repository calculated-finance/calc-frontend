import { Heading, Text, Flex, Center } from '@chakra-ui/react';
import { getDenomName } from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import Spinner from '@components/Spinner';
import { getAcculumationDifference, getNumberOfPastSwaps, getPerformanceFactor } from '@helpers/strategy/dcaPlus';
import { getStrategyResultingDenom, getConvertedSwapAmount, getStrategyInitialDenom } from '@helpers/strategy';
import { formatSignedPercentage } from '@helpers/format/formatSignedPercentage';
import useDcaPlusPerformance from '@hooks/useDcaPlusPerformance';
import { puraliseDays } from './StrategyComparison';

export function StrategyComparisonCard({ strategy }: { strategy: Strategy }) {
  const { data: performance, isLoading } = useDcaPlusPerformance(strategy.id);

  const numberPastSwaps = getNumberOfPastSwaps(strategy);
  return (
    <Flex direction="column" p={8} my={8} mx={8} borderRadius="3xl" borderColor="green.200" borderWidth={2} w={500}>
      {isLoading ? (
        <Center h={28}>
          <Spinner />
        </Center>
      ) : (
        <>
          <Heading size="xs">
            <Text as="span" color="green.200" /> {getAcculumationDifference(strategy)}{' '}
            {getDenomName(getStrategyResultingDenom(strategy))} more accumulated with DCA+
          </Heading>
          <Heading size="2xl">{formatSignedPercentage(getPerformanceFactor(performance))}</Heading>
          <Text textStyle="body">
            In comparison to traditional DCA, swapping {getConvertedSwapAmount(strategy)}{' '}
            {getDenomName(getStrategyInitialDenom(strategy))} per day for {numberPastSwaps}{' '}
            {puraliseDays(numberPastSwaps)}.
          </Text>
        </>
      )}
    </Flex>
  );
}
