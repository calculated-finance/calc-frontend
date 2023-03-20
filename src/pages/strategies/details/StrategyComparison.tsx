import { Heading, Grid, GridItem, Text, Divider, Flex, Center } from '@chakra-ui/react';
import { getDenomName } from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import Spinner from '@components/Spinner';
import useStrategyEvents, { StrategyEvent } from '@hooks/useStrategyEvents';
import {
  getAcculumationDifference,
  getNumberOfPastSwaps,
  getStandardDcaAveragePrice,
  getStandardDcaStrategyEndDate,
  getStandardDcaTotalCost,
  getStandardDcaTotalReceived,
} from '@helpers/strategy/dcaPlus';
import { formatFiat } from '@helpers/format/formatFiat';
import useFiatPrice from '@hooks/useFiatPrice';
import {
  getStrategyResultingDenom,
  getConvertedSwapAmount,
  getStrategyInitialDenom,
  getTotalReceived,
  getTotalCost,
  getAverageCost,
  getStrategyEndDate,
} from '@helpers/strategy';
import { formatSignedPercentage } from '@helpers/format/formatSignedPercentage';
import useDcaPlusPerformance from '@hooks/useDcaPlusPerformance';
import { DcaPlusPerformanceResponse } from 'src/interfaces/generated/response/get_dca_plus_performance';

function getPerformanceFactor(performance: DcaPlusPerformanceResponse | undefined) {
  const factor = Number(performance?.factor || 0);
  const rounded = Number(factor.toFixed(4));
  const difference = rounded - 1;
  return difference;
}

function StrategyComparisonCard({ strategy }: { strategy: Strategy }) {
  const { data: performance } = useDcaPlusPerformance(strategy.id);

  return (
    <Flex direction="column" p={8} my={8} mx={8} borderRadius="3xl" borderColor="green.200" borderWidth={2} w={500}>
      <Heading size="xs">
        <Text as="span" color="green.200" /> {getAcculumationDifference(strategy)}{' '}
        {getDenomName(getStrategyResultingDenom(strategy))} more accumulated with DCA+
      </Heading>
      <Heading size="2xl">{formatSignedPercentage(getPerformanceFactor(performance))}</Heading>
      <Text textStyle="body">
        In comparison to traditional DCA, swapping {getConvertedSwapAmount(strategy)}{' '}
        {getDenomName(getStrategyInitialDenom(strategy))} per day for {getNumberOfPastSwaps(strategy)} days.
      </Text>
    </Flex>
  );
}

function StrategyComparisonDetails({
  strategy,
  strategyEvents,
}: {
  strategy: Strategy;
  strategyEvents: StrategyEvent[];
}) {
  const initialDenom = getStrategyInitialDenom(strategy);

  const { price: initialDenomPrice } = useFiatPrice(initialDenom);

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={3} px={8} py={6} w="full">
      <GridItem colSpan={1} />
      <GridItem colSpan={1}>
        <Heading size="xs">DCA +</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">Traditional DCA</Heading>
      </GridItem>
      <GridItem colSpan={1} />
      <GridItem colSpan={2}>
        <Divider />
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">Accumulated</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text as="span" fontSize="sm">
          {`${getTotalReceived(strategy)} ${getDenomName(getStrategyResultingDenom(strategy))}`}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text as="span" fontSize="sm">
          {`${getStandardDcaTotalReceived(strategy)} ${getDenomName(getStrategyResultingDenom(strategy))}`}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">Swapped</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text as="span" fontSize="sm">
          {`${getTotalCost(strategy)} ${getDenomName(getStrategyInitialDenom(strategy))}`}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text as="span" fontSize="sm">
          {`${getStandardDcaTotalCost(strategy)} ${getDenomName(getStrategyInitialDenom(strategy))}`}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">Average token cost</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span">
          {formatFiat(getAverageCost(strategy) * initialDenomPrice)}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span">
          {formatFiat(getStandardDcaAveragePrice(strategy) * initialDenomPrice)}
        </Text>
      </GridItem>

      <GridItem colSpan={1}>
        <Heading size="xs">Estimated strategy end date</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span">
          {getStrategyEndDate(strategy, strategyEvents)}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span">
          {getStandardDcaStrategyEndDate(strategy, strategyEvents)}
        </Text>
      </GridItem>
    </Grid>
  );
}

export default function StrategyComparison({ strategy }: { strategy: Strategy }) {
  const { data: eventsData } = useStrategyEvents(strategy.id);

  return (
    <GridItem colSpan={6}>
      <Flex h="full" flexDirection="column">
        <Heading pb={4} size="md">
          Comparison with traditional DCA
        </Heading>
        <Flex layerStyle="panel" flexGrow={1} alignItems="start">
          {eventsData?.events ? (
            <>
              <StrategyComparisonDetails strategy={strategy} strategyEvents={eventsData.events} />
              <StrategyComparisonCard strategy={strategy} />
            </>
          ) : (
            <Center w="full" h="full" px={8} py={6}>
              <Spinner />
            </Center>
          )}
        </Flex>
      </Flex>
    </GridItem>
  );
}
