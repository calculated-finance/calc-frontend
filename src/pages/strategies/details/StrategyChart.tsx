import {
  Heading, GridItem,
  Box, Center, Select
} from '@chakra-ui/react';
import Spinner from '@components/Spinner';
import getDenomInfo from '@utils/getDenomInfo';
import useStrategyEvents from '@hooks/useStrategyEvents';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Strategy } from '@hooks/useStrategies';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getStrategyInitialDenom } from '../../../helpers/getStrategyInitialDenom';

export function StrategyChart({ strategy }: { strategy: Strategy; }) {
  const [days, setDays] = useState(1);

  const { data: eventsData } = useStrategyEvents(strategy.id);

  const events = eventsData?.events;

  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDays(Number(event.target.value));
  };

  const { data: coingeckoData, isLoading } = useQuery(['coingecko', days], async () => {
    const result = await fetch(
      `https://api.coingecko.com/api/v3/coins/kujira/market_chart?vs_currency=usd&days=${days}}`
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
      if (e !== BreakException)
        throw e;
    }

    console.log(currentAmount);

    return currentAmount;
  };

  const chartData = coingeckoData?.prices.map((price) => ({
    date: new Date(price[0]),
    price: price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation),
  }));

  console.log('chartData', chartData);

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
        <Heading pt={6} pl={6} size="md">
          Portfolio accumulated with this strategy
        </Heading>
        {/* <Stat>
                  <StatNumber>
                    {getDenomInfo(resultingDenom).conversion(Number(0))} {getDenomInfo(resultingDenom).name}
                  </StatNumber>
                </Stat> */}
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
                y="price" />
            </VictoryChart>
          )}
        </Center>
      </Box>
    </GridItem>
  );
}
