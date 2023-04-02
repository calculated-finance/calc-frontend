import { Heading, GridItem, Box, Center } from '@chakra-ui/react';
import Spinner from '@components/Spinner';
import useStrategyEvents from '@hooks/useStrategyEvents';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';
import { useRef, useState } from 'react';
import { Strategy } from '@hooks/useStrategies';
import { useSize } from 'ahooks';
import useFiatPriceHistory from '@hooks/useFiatPriceHistory';
import { getStrategyResultingDenom } from '@helpers/strategy';
import { getChartData, getChartDataSwaps } from './getChartData';
import { StrategyChartStats } from './StrategyChartStats';
import { DaysRadio } from './DaysRadio';

export function StrategyChart({ strategy }: { strategy: Strategy }) {
  const [days, setDays] = useState('3');

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useSize(elementRef);

  const { data: events } = useStrategyEvents(strategy.id);

  const resultingDenom = getStrategyResultingDenom(strategy);

  const { data: coingeckoData } = useFiatPriceHistory(resultingDenom, days);

  const chartData = getChartData(events, coingeckoData?.prices);
  const swapsData = getChartDataSwaps(events, coingeckoData?.prices, true);

  return (
    <GridItem colSpan={6}>
      <Box layerStyle="panel" position="relative">
        {events && <StrategyChartStats strategy={strategy} strategyEvents={events} />}
        <Box p={6} position="absolute" top={0} right={0}>
          <DaysRadio value={days} onChange={setDays} />
        </Box>
        <Box h={0}>
          <svg>
            <defs>
              <linearGradient id="myGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1AEFAF" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </Box>

        <Center width="full" height={250} ref={elementRef} px={6}>
          {!chartData || !swapsData ? (
            <Spinner />
          ) : (
            <VictoryChart
              height={dimensions?.height}
              width={dimensions?.width}
              containerComponent={<VictoryVoronoiContainer />}
              padding={{ left: 60, bottom: 40, top: 10 }}
            >
              <VictoryAxis
                dependentAxis
                style={{
                  tickLabels: { fill: 'white' },
                }}
                tickFormat={(tick) => {
                  if (tick >= 1000) {
                    return `$${(tick / 1000).toFixed(1)}k`;
                  }
                  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tick);
                }}
              />
              <VictoryAxis
                style={{
                  tickLabels: { fill: 'white' },
                }}
                tickFormat={(tick) =>
                  new Date(tick).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }
              />
              <VictoryScatter
                style={{ data: { fill: '#1AEFAF' } }}
                size={5}
                data={swapsData}
                x="date"
                y="price"
                labelComponent={<VictoryTooltip />}
              />
              <VictoryArea
                style={{
                  data: { stroke: '#1AEFAF', fillOpacity: '10%', fill: 'url(#myGradient)', strokeWidth: 2 },
                }}
                data={chartData}
                standalone={false}
                interpolation="step"
                labelComponent={<VictoryTooltip />}
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
