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
import { buildLineChartData, buildSwapsChartData, convertEvents } from '@helpers/chart';
import {
  getChartDataSwapsNew,
  getChartDataSwapsTraditional,
  getChartDataTraditional,
  getPriceData,
} from './getChartData';
import { StrategyChartStats } from './StrategyChartStats';
import { DaysRadio } from './DaysRadio';

function formatPriceTick(priceMax: number): ((...args: any[]) => any) | unknown[] | null | undefined {
  return (tick) => {
    if (tick >= 1000) {
      return `$${(tick / 1000).toFixed(1)}k`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tick * priceMax);
  };
}

function formatTimeTick(): unknown[] | ((...args: any[]) => any) | null | undefined {
  return (tick) =>
    new Date(tick).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
}

export function StrategyComparisonChart({ strategy }: { strategy: Strategy }) {
  const [days, setDays] = useState('3');

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useSize(elementRef);

  const { data: eventsData } = useStrategyEvents(strategy.id);

  const events = eventsData?.events;

  const resultingDenom = getStrategyResultingDenom(strategy);

  const { data: coingeckoData } = useFiatPriceHistory(resultingDenom, days);

  const now = new Date();
  const fromDate = new Date(now.getTime() - parseInt(days, 10) * 24 * 60 * 60 * 1000);

  if (!events) {
    return null;
  }

  const accumulatedEvents = convertEvents(eventsData?.events);
  const lineChartData = buildLineChartData(accumulatedEvents, fromDate, now);
  const swapsChartData = buildSwapsChartData(accumulatedEvents, fromDate, now);

  const priceData = getPriceData(coingeckoData?.prices);

  if (!accumulatedEvents || !priceData) {
    return null;
  }

  const lineChartMax = Math.max(...lineChartData.map((d) => d.amount));
  const priceMax = Math.max(...priceData.map((d) => d.amount));

  const timeAxisStyle = {
    axis: { stroke: 'white' },
    ticks: { padding: 2 },
    tickLabels: { fill: 'white' },
  };
  const priceAxisStyle = {
    axis: { stroke: '#8B8CA7' },
    tickLabels: { fill: '#8B8CA7' },
  };
  const priceLineStyle = { data: { stroke: '#8B8CA7', strokeWidth: 1 } };
  const valueLineStyle = { data: { stroke: '#1AEFAF' } };
  const valueAxisStyle = {
    axis: { stroke: 'white' },
    tickLabels: { fill: 'white' },
  };
  const valueScatterStyle = { data: { fill: '#1AEFAF' } };
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
            domain={{ y: [0, lineChartMax * 1.1] }} // 1.5 here represents a good height, but it should be dynamic based on the maxima
          >
            {/* Time Axis */}
            <VictoryAxis style={timeAxisStyle} tickFormat={formatTimeTick()} />
            {/* Value axis */}
            <VictoryAxis dependentAxis key={0} style={valueAxisStyle} />
            {/* Price axis */}
            <VictoryAxis
              dependentAxis
              key={2}
              style={priceAxisStyle}
              orientation="right"
              offsetX={80}
              tickFormat={formatPriceTick(priceMax)}
            />
            {/* Price line */}
            <VictoryLine
              key={2}
              data={priceData}
              style={priceLineStyle}
              // normalize data
              y={(datum) => datum.amount / priceMax}
              x="date"
              labelComponent={<VictoryTooltip />}
            />
            {/* Value line */}
            <VictoryLine
              key={0}
              data={lineChartData}
              style={valueLineStyle}
              y="amount"
              x="time"
              interpolation="stepAfter"
              labelComponent={<VictoryTooltip />}
            />

            {/* Value scatter */}
            <VictoryScatter
              style={valueScatterStyle}
              size={5}
              data={swapsChartData}
              x="time"
              y="amount"
              labelComponent={<VictoryTooltip />}
            />
          </VictoryChart>
        </Center>
      </Box>
    </GridItem>
  );
}
