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
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Strategy } from '@hooks/useStrategies';
import useFiatPrice from '@hooks/useFiatPrice';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getStrategyInitialDenom } from '../../../helpers/getStrategyInitialDenom';
import { formatFiat } from './StrategyPerformance';

export function StrategyChart({ strategy }: { strategy: Strategy }) {
  const [days, setDays] = useState(1);

  const { data: eventsData } = useStrategyEvents(strategy.id);

  const events = eventsData?.events;

  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const { price: resultingDenomPrice, isLoading: resultingDenomPriceIsLoading } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice, isLoading: initialDenomPriceIsLoading } = useFiatPrice(initialDenom);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDays(Number(event.target.value));
  };

  const { data: coingeckoData, isLoading } = useQuery(['coingecko', days], async () => {
    const result = await fetch(
      `https://api.coingecko.com/api/v3/coins/kujira/market_chart?vs_currency=usd&days=${days}}`,
    );
    return result.json();
  });

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

  console.log('eventsWithAccumulation', eventsWithAccumulation);

  const BreakException = {};

  const findCurrentAmountInTime = (time, events) => {
    let currentAmount = 0;
    try {
      events.forEach((event) => {
        console.log(new Date(time));
        if (event.time > new Date(time)) {
          throw BreakException;
        }
        currentAmount = event.accumulation;
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }

    console.log(currentAmount);

    return currentAmount;
  };

  const chartData = coingeckoData?.prices.map((price) => ({
    date: new Date(price[0]),
    price: price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation),
  }));

  console.log('chartData', chartData);

  const marketValueAmount = strategy.received_amount.amount;

  const costAmount = strategy.swapped_amount.amount;

  const marketValueValue = new DenomValue({ amount: marketValueAmount, denom: resultingDenom });
  const costValue = new DenomValue({ amount: costAmount, denom: initialDenom });

  const costInFiat = costValue.toConverted() * initialDenomPrice;
  const marketValueInFiat = marketValueValue.toConverted() * resultingDenomPrice;

  const profit = marketValueInFiat - costInFiat;

  const percentageChange = `${(costInFiat ? (profit / costInFiat) * 100 : 0).toFixed(2)}%`;

  const color = profit > 0 ? 'green.200' : profit < 0 ? 'red.200' : 'white';

  // const chartData = completedEvents?.map((event) => {
  //   const amount = Number(event.data.dca_vault_execution_completed.received.amount);
  //   totalAmount -= amount;
  //   return {
  //     date: new Date(Number(event.timestamp) / 1000000),
  //     price: totalAmount,
  //   };
  // });
  // const dummyChartData = [
  //   { x: new Date(1982, 1, 1), y: 125 },
  //   { x: new Date(1987, 1, 1), y: 257 },
  //   { x: new Date(1993, 1, 1), y: 345 },
  //   { x: new Date(1997, 1, 1), y: 515 },
  //   { x: new Date(2001, 1, 1), y: 132 },
  //   { x: new Date(2005, 1, 1), y: 305 },
  //   { x: new Date(2011, 1, 1), y: 270 },
  //   { x: new Date(2015, 1, 1), y: 470 },
  // ];
  // console.log(dummyChartData);
  return (
    <GridItem colSpan={6}>
      <Box layerStyle="panel">
        <Stack spacing={3} p={6}>
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
        <Select mx={6} mt={3} w={200} onChange={handleSelect}>
          <option value={1}>1D</option>
          <option value={3}>3D</option>
          <option value={7}>1W</option>
          <option value={30}>1M</option>
          <option value={90}>3M</option>
          <option value={365}>1Y</option>
        </Select>
        <Center width="full" h={400}>
          {isLoading ? (
            <Spinner />
          ) : (
            <VictoryChart theme={VictoryTheme.material} width={1024} height={300}>
              {/* victory line graph thats full width */}
              <VictoryLine
                style={{
                  data: { stroke: '#1AEFAF' },
                  parent: { border: '1px solid #ccc' },
                }}
                data={chartData}
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
