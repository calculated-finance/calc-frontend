import { Heading, Grid, GridItem, Text, Divider, Flex, Center } from '@chakra-ui/react';
import getDenomInfo, { getDenomName } from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import { getStrategyInitialDenom } from 'src/helpers/getStrategyInitialDenom';
import Spinner from '@components/Spinner';
import useStrategyEvents, { StrategyEvent } from '@hooks/useStrategyEvents';
import { getStrategyEndDate } from 'src/helpers/getStrategyEndDate';
import { getTotalReceived } from 'src/helpers/strategy/getTotalReceived';
import { isBuyStrategy } from 'src/helpers/isBuyStrategy';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getTotalCost } from './getTotalCost';
import {
  getStandardDcaAveragePrice,
  getStandardDcaStrategyEndDate,
  getStandardDcaTotalCost,
  getStandardDcaTotalReceived,
} from 'src/helpers/strategy/dcaPlus';
import { getAverageCost } from './getAverageCost';
import { formatFiat } from 'src/helpers/format/formatFiat';
import { getFiatPrice } from 'src/helpers/getFiatPrice';
import useFiatPrice from '@hooks/useFiatPrice';

function StrategyComparisonCard() {
  return (
    <Flex direction="column" p={8} my={8} mx={8} borderRadius="3xl" borderColor="green.200" borderWidth={2} w={500}>
      <Heading size="xs">
        <Text as="span" color="green.200">
          +20.13 KUJI
        </Text>{' '}
        more accumulated with DCA+
      </Heading>
      <Heading size="2xl">+ 12%</Heading>
      <Text textStyle="body">In comparison to traditional DCA, swapping 100 USK per day for 10 days.</Text>
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
          {`${getStandardDcaTotalCost(strategy)} ${getDenomName(getStrategyInitialDenom(strategy))}`}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text as="span" fontSize="sm">
          {`${getTotalCost(strategy, strategyEvents)} ${getDenomName(getStrategyInitialDenom(strategy))}`}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">Average token cost</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span">
          {formatFiat(getAverageCost(strategy, strategyEvents) * initialDenomPrice)}
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

  console.log(strategy);

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
              <StrategyComparisonCard />
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
