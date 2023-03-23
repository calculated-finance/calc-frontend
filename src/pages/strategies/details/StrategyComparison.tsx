import { Heading, Grid, GridItem, Text, Divider, Flex, Center } from '@chakra-ui/react';
import { getDenomName } from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import Spinner from '@components/Spinner';
import useStrategyEvents, { StrategyEvent } from '@hooks/useStrategyEvents';
import {
  getRemainingExecutionsRange,
  getStandardDcaAverageCost,
  getStandardDcaAveragePrice,
  getStandardDcaRemainingBalance,
  getStandardDcaRemainingExecutions,
  getStandardDcaTotalReceived,
  getStandardDcaTotalSwapped,
} from '@helpers/strategy/dcaPlus';
import { formatFiat } from '@helpers/format/formatFiat';
import useFiatPrice from '@hooks/useFiatPrice';
import getStrategyBalance, {
  getStrategyResultingDenom,
  getStrategyInitialDenom,
  getTotalReceived,
  getAverageCost,
  getTotalSwapped,
  getAveragePrice,
  isBuyStrategy,
} from '@helpers/strategy';
import { StrategyComparisonCard } from './StrategyComparisonCard';

function StrategyComparisonDetails({
  strategy,
  strategyEvents,
}: {
  strategy: Strategy;
  strategyEvents: StrategyEvent[];
}) {
  const { price: initialDenomPrice } = useFiatPrice(getStrategyInitialDenom(strategy));
  const { price: resultingDenomPrice } = useFiatPrice(getStrategyResultingDenom(strategy));

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
          {getTotalReceived(strategy)} {getDenomName(getStrategyResultingDenom(strategy))}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text as="span" fontSize="sm">
          {getStandardDcaTotalReceived(strategy)} {getDenomName(getStrategyResultingDenom(strategy))}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">Swapped</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text as="span" fontSize="sm">
          {getTotalSwapped(strategy)} {getDenomName(getStrategyInitialDenom(strategy))}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text as="span" fontSize="sm">
          {getStandardDcaTotalSwapped(strategy)} {getDenomName(getStrategyInitialDenom(strategy))}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">Balance remaining</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text as="span" fontSize="sm">
          {getStrategyBalance(strategy)} {getDenomName(getStrategyInitialDenom(strategy))}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text as="span" fontSize="sm">
          {getStandardDcaRemainingBalance(strategy)} {getDenomName(getStrategyInitialDenom(strategy))}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">{isBuyStrategy(strategy) ? 'Average token cost' : 'Average token sell price'}</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span">
          {isBuyStrategy(strategy)
            ? formatFiat(getAverageCost(strategy) * initialDenomPrice)
            : formatFiat(getAveragePrice(strategy) * resultingDenomPrice)}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span">
          {isBuyStrategy(strategy)
            ? formatFiat(getStandardDcaAverageCost(strategy) * initialDenomPrice)
            : formatFiat(getStandardDcaAveragePrice(strategy) * resultingDenomPrice)}
        </Text>
      </GridItem>

      <GridItem colSpan={1}>
        <Heading size="xs">Estimated days remaining</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span">
          {getRemainingExecutionsRange(strategy).min} - {getRemainingExecutionsRange(strategy).max}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span">
          {getStandardDcaRemainingExecutions(strategy)}
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
          Comparison against traditional DCA
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
