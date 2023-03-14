import { Heading, GridItem, Box, Center } from '@chakra-ui/react';
import useStrategyEvents from '@hooks/useStrategyEvents';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';
import { useRef, useState } from 'react';
import { Strategy } from '@hooks/useStrategies';
import { useSize } from 'ahooks';
import useFiatPriceHistory from '@hooks/useFiatPriceHistory';
import { getStrategyResultingDenom } from '@helpers/strategy';
import {
  getChartDataSwapsNew,
  getChartDataSwapsTraditional,
  getChartDataTraditional,
  getPriceData,
} from './getChartData';
import { StrategyChartStats } from './StrategyChartStats';
import { DaysRadio } from './DaysRadio';
import { buildChartDataFromEventData } from '@helpers/chart';

export function StrategyComparisonChart({ strategy }: { strategy: Strategy }) {
  const [days, setDays] = useState('3');

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useSize(elementRef);

  const { data: eventsData } = useStrategyEvents(strategy.id);

  const events = eventsData?.events;

  const resultingDenom = getStrategyResultingDenom(strategy);

  const { data: coingeckoData } = useFiatPriceHistory(resultingDenom, days);

  // time now
  const now = new Date();
  // time based on value of variable days
  const fromDate = new Date(now.getTime() - parseInt(days) * 24 * 60 * 60 * 1000);

  if (!events) {
    return null;
  }

  const swapsData = buildChartDataFromEventData(events, fromDate, now);
  console.log('swapsData', swapsData);

  const chartDataTraditional = getChartDataTraditional(events, coingeckoData?.prices);
  const swapsDataTradtional = getChartDataSwapsTraditional(events, coingeckoData?.prices, true);

  const priceData = getPriceData(coingeckoData?.prices);

  // check swapsData, chartDataTraditional, priceData are valid
  if (!swapsData || !chartDataTraditional || !priceData) {
    return null;
  }

  const data = [swapsData, chartDataTraditional, priceData];
  // find maxima for normalizing data
  const maxima = data.map((dataset) => Math.max(...dataset.map((d) => d.amount)));

  const colors = ['#1AEFAF', '#1A89EF', '#8B8CA7'];

  // return <CustomTheme />;

  return (
    <GridItem colSpan={6}>
      <Heading size="md" pb={4}>
        Strategy history
      </Heading>

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
          <VictoryChart
            height={dimensions?.height}
            width={dimensions?.width}
            containerComponent={<VictoryVoronoiContainer />}
            padding={{ left: 60, bottom: 40, top: 10, right: 80 }}
            // domain={{ y: [0, 1] }} // 1.5 here represents a good height, but it should be dynamic based on the maxima
          >
            <VictoryAxis
              style={{
                axis: { stroke: 'white' },
                ticks: { padding: 2 },
                tickLabels: { fill: 'white' },
              }}
              tickFormat={(tick) =>
                new Date(tick).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              }
            />
            <VictoryAxis
              dependentAxis
              key={0}
              style={{
                axis: { stroke: 'white' },
                tickLabels: { fill: 'white' },
              }}
              // Use normalized tickValues (0 - 1)
              // tickValues={[0.25, 0.5, 0.75, 1]}
              // Re-scale ticks by multiplying by correct maxima
              // tickFormat={(tick) => {
              //   if (tick >= 1000) {
              //     return `$${(tick / 1000).toFixed(1)}k`;
              //   }
              //   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tick * maxima[0]);
              // }}
            />

            <VictoryAxis
              dependentAxis
              key={2}
              style={{
                axis: { stroke: '#8B8CA7' },
                tickLabels: { fill: '#8B8CA7' },
              }}
              // Use normalized tickValues (0 - 1)
              // tickValues={[0.25, 0.5, 0.75, 1]}
              // Re-scale ticks by multiplying by correct maxima
              orientation="right"
              offsetX={80}
              tickFormat={(tick) => {
                if (tick >= 1000) {
                  return `$${(tick / 1000).toFixed(1)}k`;
                }
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tick * maxima[2]);
              }}
            />
            <VictoryLine
              key={0}
              data={data[0]}
              style={{ data: { stroke: colors[0] } }}
              // normalize data
              y={(datum) => datum.amount}
              // y={(datum) => datum.amount / maxima[0]}
              x="time"
              interpolation="stepAfter"
              labelComponent={<VictoryTooltip />}
            />
            {/* <VictoryLine
              key={0}
              data={data[1]}
              style={{ data: { stroke: colors[1] } }}
              // normalize data
              y={(datum) => datum.amount / maxima[0]}
              x="date"
              interpolation="step"
              labelComponent={<VictoryTooltip />}
            /> */}

            <VictoryLine
              key={2}
              data={data[2]}
              style={{ data: { stroke: colors[2], strokeWidth: 1 } }}
              // normalize data
              y={(datum) => datum.amount / maxima[2]}
              x="date"
              labelComponent={<VictoryTooltip />}
            />
            {/* <VictoryScatter
              style={{ data: { fill: colors[1] } }}
              size={5}
              data={swapsDataTradtional}
              x="date"
              y={(datum) => datum.price / maxima[0]}
              labelComponent={<VictoryTooltip />}
            /> */}
            <VictoryScatter
              style={{ data: { fill: colors[0] } }}
              size={5}
              data={swapsData}
              x="time"
              y={(datum) => datum.amount}
              // y={(datum) => datum.amount / maxima[0]}
              labelComponent={<VictoryTooltip />}
            />
          </VictoryChart>
        </Center>
      </Box>
    </GridItem>
  );
}
