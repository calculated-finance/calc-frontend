import {
  Heading,
  GridItem,
  Box,
  Center,
  Select,
  Stat,
  StatNumber,
  Stack,
  StatLabel,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import Spinner from '@components/Spinner';
import getDenomInfo, { DenomValue } from '@utils/getDenomInfo';
import useStrategyEvents from '@hooks/useStrategyEvents';
import { VictoryChart, VictoryContainer, VictoryLine, VictoryTheme } from 'victory';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Strategy } from '@hooks/useStrategies';
import useFiatPrice from '@hooks/useFiatPrice';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { useSize } from 'ahooks';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getStrategyInitialDenom } from '../../../helpers/getStrategyInitialDenom';
import { formatFiat } from './StrategyPerformance';

export function StrategyChart({ strategy }: { strategy: Strategy }) {
  const [days, setDays] = useState(1);

  const elementRef = useRef();
  const dimensions = useSize(elementRef);

  const { data: eventsData, isLoading: isEventsLoading } = useStrategyEvents(strategy.id);

  const events = eventsData?.events;

  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const { price: resultingDenomPrice, isLoading: resultingDenomPriceIsLoading } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice, isLoading: initialDenomPriceIsLoading } = useFiatPrice(initialDenom);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDays(Number(event.target.value));
  };

  const { data: coingeckoData, isLoading: isCoinGeckoLoading } = useQueryWithNotification(
    ['coingecko', days],
    async () => {
      const result = await fetch(
        `https://api.coingecko.com/api/v3/coins/kujira/market_chart?vs_currency=usd&days=${days}}`,
      );
      return result.json();
    },
  );

  const { conversion } = getDenomInfo(resultingDenom);

  const completedEvents = events?.filter((event) => event.data.dca_vault_execution_completed);

  if (!completedEvents) {
    return null;
  }

  // let totalAmount = Number(data.vault.received_amount);
  let totalAmount = 0;

  const eventsWithAccumulation = completedEvents?.map((event) => {
    const amount = conversion(Number(event.data.dca_vault_execution_completed.received.amount));
    totalAmount += Number(amount);
    return {
      time: new Date(Number(event.timestamp) / 1000000),
      accumulation: totalAmount,
    };
  });

  const BreakException = {};

  const findCurrentAmountInTime = (time, events) => {
    let currentAmount = 0;
    try {
      events.forEach((event) => {
        if (event.time > new Date(time)) {
          throw BreakException;
        }
        currentAmount = event.accumulation;
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }

    return currentAmount;
  };

  const chartData = coingeckoData?.prices.map((price) => ({
    date: new Date(price[0]),
    price: price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation),
  }));

  const marketValueAmount = strategy.received_amount.amount;

  const costAmount = strategy.swapped_amount.amount;

  const marketValueValue = new DenomValue({ amount: marketValueAmount, denom: resultingDenom });
  const costValue = new DenomValue({ amount: costAmount, denom: initialDenom });

  const costInFiat = costValue.toConverted() * initialDenomPrice;
  const marketValueInFiat = marketValueValue.toConverted() * resultingDenomPrice;

  const profit = marketValueInFiat - costInFiat;

  const percentageChange = `${(costInFiat ? (profit / costInFiat) * 100 : 0).toFixed(2)}%`;

  const color = profit > 0 ? 'green.200' : profit < 0 ? 'red.200' : 'white';

  console.log('height', dimensions?.height);
  console.log('width', dimensions?.width);

  return (
    <GridItem colSpan={6}>
      <Box layerStyle="panel" position="relative">
        <Stack spacing={3} pt={6} pl={6}>
          <Stat>
            <StatLabel fontSize="lg">Portfolio accumulated with this strategy</StatLabel>
            <StatNumber>
              {formatFiat(
                getDenomInfo(resultingDenom).conversion(Number(strategy.received_amount.amount) * resultingDenomPrice),
              )}
            </StatNumber>
            <StatHelpText color={color}>
              <StatArrow type={color === 'green.200' ? 'increase' : 'decrease'} />
              {formatFiat(profit)} : {percentageChange}
            </StatHelpText>
          </Stat>
        </Stack>
        <Box p={6} position="absolute" top={0} right={0}>
          <Select mx={6} mt={3} w={200} onChange={handleSelect}>
            <option value={1}>1D</option>
            <option value={3}>3D</option>
            <option value={7}>1W</option>
            <option value={30}>1M</option>
            <option value={90}>3M</option>
            <option value={365}>1Y</option>
          </Select>
        </Box>
        <Center width="full" height={250} ref={elementRef}>
          {!coingeckoData || isCoinGeckoLoading || isEventsLoading || !eventsData ? (
            <Spinner />
          ) : (
            <VictoryChart height={dimensions?.height} width={dimensions?.width}>
              <VictoryLine
                style={{
                  data: { stroke: '#1AEFAF' },
                }}
                data={chartData}
                standalone={false}
                interpolation="step"
                // labels={({ datum }) => datum.price.toFixed(2)}
                x="date"
                y="price"
              />
            </VictoryChart>
          )}
        </Center>
      </Box>
    </GridItem>
  );
}
