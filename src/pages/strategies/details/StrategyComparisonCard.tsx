import { Heading, Text, Flex, Center, Stack } from '@chakra-ui/react';
import { getDenomName } from '@utils/getDenomInfo';
import { Strategy } from '@models/Strategy';
import Spinner from '@components/Spinner';
import {
  getAccumulationGained,
  getNumberOfPastSwaps,
  getPerformanceFactor,
  getSwappedSaved,
} from '@helpers/strategy/dcaPlus';
import { getStrategyResultingDenom, getSwapAmount, getStrategyInitialDenom } from '@helpers/strategy';
import { formatSignedPercentage } from '@helpers/format/formatSignedPercentage';
import useDcaPlusPerformance from '@hooks/useDcaPlusPerformance';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';

export function puraliseDays(val: number) {
  return val === 1 ? 'day' : 'days';
}

const DAYS_BEFORE_REVEAL = 3;

function DifferenceComparison({ strategy, performanceFactor }: { strategy: Strategy; performanceFactor: number }) {
  const accumulationDifference = getAccumulationGained(strategy);
  const swappedDifference = getSwappedSaved(strategy);

  if (performanceFactor > 0) {
    if (accumulationDifference > 0) {
      return (
        <>
          <Text as="span" color="green.200">
            +{accumulationDifference}
          </Text>{' '}
          more {getDenomName(getStrategyResultingDenom(strategy))} accumulated with DCA+
        </>
      );
    }
    return (
      <>
        <Text as="span" color="green.200">
          +{swappedDifference}
        </Text>{' '}
        more {getDenomName(getStrategyInitialDenom(strategy))} saved with DCA+
      </>
    );
  }

  if (accumulationDifference > 0) {
    return (
      <>
        <Text as="span" color="grey.200">
          +{accumulationDifference}
        </Text>{' '}
        more {getDenomName(getStrategyResultingDenom(strategy))} accumulated with DCA+
      </>
    );
  }
  return (
    <>
      <Text as="span" color="grey.200">
        {swappedDifference}
      </Text>{' '}
      {getDenomName(getStrategyInitialDenom(strategy))} saved with DCA+
    </>
  );
}

export function StrategyComparisonCard({ strategy }: { strategy: Strategy }) {
  const { data: performance, isLoading } = useDcaPlusPerformance(strategy.id, isDcaPlus(strategy));

  const numberPastSwaps = getNumberOfPastSwaps(strategy);

  const isPending = numberPastSwaps < DAYS_BEFORE_REVEAL;
  const performanceFactor = getPerformanceFactor(performance);

  const color = performanceFactor > 0 && !isPending ? 'green.200' : 'grey.200';

  return (
    <Flex direction="column" p={6} borderRadius="3xl" borderColor={color} borderWidth={2}>
      {isLoading ? (
        <Center h="full" minH={40} minW={80}>
          <Spinner />
        </Center>
      ) : (
        <Flex alignItems="center" h="full">
          {isPending ? (
            <Stack spacing={8}>
              <Heading size="xs" color="grey.200">
                Check back later to compare performance.
              </Heading>
              <Stack spacing={4}>
                <Heading size="md" fontSize={24}>
                  Comparison pending...
                </Heading>
                <Text textStyle="body">
                  We need to allow at least 3 transactions before comparing traditional DCA with DCA+.
                </Text>
              </Stack>
            </Stack>
          ) : (
            <Stack>
              <Heading size="xs">
                <DifferenceComparison strategy={strategy} performanceFactor={performanceFactor} />
              </Heading>
              <Heading size="3xl">{formatSignedPercentage(performanceFactor)}</Heading>
              <Text textStyle="body">
                In comparison to traditional DCA, swapping {getSwapAmount(strategy)}{' '}
                {getDenomName(getStrategyInitialDenom(strategy))} per day for {numberPastSwaps}{' '}
                {puraliseDays(numberPastSwaps)}.
              </Text>
            </Stack>
          )}
        </Flex>
      )}
    </Flex>
  );
}
