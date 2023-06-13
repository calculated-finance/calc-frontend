import { Heading, Grid, GridItem, Text, Divider, Flex, Center, Stack } from '@chakra-ui/react';
import { getDenomName } from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import Spinner from '@components/Spinner';
import useStrategyEvents, { StrategyEvent } from '@hooks/useStrategyEvents';
import {
  getRemainingExecutionsRange,
  getStandardDcaEndDate,
  getStandardDcaAveragePurchasePrice,
  getStandardDcaAverageSellPrice,
  getStandardDcaRemainingBalance,
  getStandardDcaTotalReceived,
  getStandardDcaTotalSwapped,
} from '@helpers/strategy/dcaPlus';
import { formatFiat } from '@helpers/format/formatFiat';
import useFiatPrice from '@hooks/useFiatPrice';
import getStrategyBalance, {
  getStrategyResultingDenom,
  getStrategyInitialDenom,
  getTotalReceived,
  getAveragePurchasePrice,
  getTotalSwapped,
  getAverageSellPrice,
  isBuyStrategy,
  isStrategyOperating,
  isStrategyCancelled,
} from '@helpers/strategy';
import { differenceInDays } from 'date-fns';
import useDexFee from '@hooks/useDexFee';
import { TransactionType } from '@components/TransactionType';
import { StrategyComparisonCard } from './StrategyComparisonCard';

function EstimatedDaysRemaining({ strategy, strategyEvents }: { strategy: Strategy; strategyEvents: StrategyEvent[] }) {
  const standardDcaEndDate = getStandardDcaEndDate(strategy, strategyEvents);
  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Estimated days remaining</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span">
          {isStrategyOperating(strategy)
            ? `${getRemainingExecutionsRange(strategy).min} - ${getRemainingExecutionsRange(strategy).max}`
            : 0}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span" color="grey.200">
          {standardDcaEndDate && differenceInDays(standardDcaEndDate, new Date())}
        </Text>
      </GridItem>
    </>
  );
}

function StrategyComparisonDetails({
  strategy,
  strategyEvents,
  initialDenomPrice,
  resultingDenomPrice,
}: {
  strategy: Strategy;
  strategyEvents: StrategyEvent[];
  initialDenomPrice: number;
  resultingDenomPrice: number;
}) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const { dexFee } = useDexFee(
    initialDenom,
    resultingDenom,
    isBuyStrategy(strategy) ? TransactionType.Buy : TransactionType.Sell,
  );

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={3} w="full">
      <GridItem colSpan={1} />
      <GridItem colSpan={1}>
        <Heading size="xs">DCA +</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs" color="grey.200">
          Simulated traditional DCA
        </Heading>
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
        <Text as="span" fontSize="sm" color="grey.200">
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
        <Text as="span" fontSize="sm" color="grey.200">
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
        <Text as="span" fontSize="sm" color="grey.200">
          {getStandardDcaRemainingBalance(strategy)} {getDenomName(getStrategyInitialDenom(strategy))}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">{isBuyStrategy(strategy) ? 'Average token cost' : 'Average token sell price'}</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span">
          {isBuyStrategy(strategy)
            ? formatFiat(getAveragePurchasePrice(strategy, dexFee), getStrategyInitialDenom(strategy).name)
            : formatFiat(getAverageSellPrice(strategy, dexFee) * resultingDenomPrice)}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" as="span" color="grey.200">
          {isBuyStrategy(strategy)
            ? formatFiat(getStandardDcaAveragePurchasePrice(strategy, dexFee), getStrategyInitialDenom(strategy).name)
            : formatFiat(getStandardDcaAverageSellPrice(strategy, dexFee) * resultingDenomPrice)}
        </Text>
      </GridItem>

      {!isStrategyCancelled(strategy) && <EstimatedDaysRemaining strategy={strategy} strategyEvents={strategyEvents} />}
    </Grid>
  );
}

export default function StrategyComparison({ strategy }: { strategy: Strategy }) {
  const { data: events } = useStrategyEvents(strategy.id);

  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const { price: initialDenomPrice } = useFiatPrice(initialDenom);
  const { price: resultingDenomPrice } = useFiatPrice(resultingDenom);

  const isLoading = !events || !initialDenomPrice || !resultingDenomPrice;

  return (
    <GridItem colSpan={6}>
      <Flex h="full" flexDirection="column">
        <Heading pb={4} size="md">
          Comparison against traditional DCA
        </Heading>
        <Flex layerStyle="panel" flexGrow={1} p={8} alignItems="start">
          {!isLoading ? (
            <Stack direction={['column', null, null, null, 'row']} w="full" gap={8}>
              <StrategyComparisonDetails
                strategy={strategy}
                strategyEvents={events}
                initialDenomPrice={initialDenomPrice}
                resultingDenomPrice={resultingDenomPrice}
              />
              <StrategyComparisonCard strategy={strategy} />
            </Stack>
          ) : (
            <Center w="full" h="full" px={10} py={6}>
              <Spinner />
            </Center>
          )}
        </Flex>
      </Flex>
    </GridItem>
  );
}
