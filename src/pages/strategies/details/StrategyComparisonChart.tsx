import { Heading, GridItem, Box, Center, HStack, Stack } from '@chakra-ui/react';
import useStrategyEvents from '@hooks/useStrategyEvents';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';
import { useRef, useState } from 'react';
import { Strategy } from '@models/Strategy';
import { useSize } from 'ahooks';
import useFiatPriceHistory from '@hooks/useFiatPriceHistory';
import { getStrategyInitialDenom, getStrategyResultingDenom, getTotalReceived, isBuyStrategy } from '@helpers/strategy';
import { buildLineChartData, buildSwapsChartData, convertDcaPlusEvents, convertTradEvents } from '@helpers/chart';
import { getDenomName } from '@utils/getDenomInfo';
import Spinner from '@components/Spinner';
import { getStandardDcaTotalReceived } from '@helpers/strategy/dcaPlus';
import { DenomInfo } from '@utils/DenomInfo';
import { getPriceData } from './getChartData';
import { DaysRadio } from './DaysRadio';
import { StrategyComparisonChartStats } from './StrategyComparisonChartStats';

function formatPriceTick(priceMax: number) {
  return (tick: number) => {
    if (tick >= 1000) {
      return `$${(tick / 1000).toFixed(1)}k`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tick * priceMax);
  };
}

function formatTimeTick() {
  return (tick: number) =>
    new Date(tick).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
}
// legend with the strategy names and their line colors
function StrategyComparisonLegend({ denom }: { denom: DenomInfo }) {
  return (
    <HStack spacing={4}>
      <HStack spacing={1}>
        <Heading fontSize="xs">DCA+ </Heading>

        <svg width="20" height="20">
          <line x1="0" y1="10" x2="20" y2="10" style={{ stroke: '#1AEFAF', strokeWidth: 2 }} />
        </svg>
      </HStack>
      <HStack spacing={1}>
        <Heading fontSize="xs"> Traditional DCA </Heading>
        <svg width="20" height="20">
          <line x1="0" y1="10" x2="20" y2="10" style={{ stroke: '#1A89EF', strokeWidth: 2 }} />
        </svg>
      </HStack>
      <HStack spacing={1}>
        <Heading fontSize="xs">{getDenomName(denom)} Price </Heading>
        <svg width="20" height="20">
          <line x1="0" y1="10" x2="20" y2="10" style={{ stroke: '#8B8CA7', strokeWidth: 1 }} />
        </svg>
      </HStack>
    </HStack>
  );
}

export function StrategyComparisonChart({ strategy }: { strategy: Strategy }) {
  const [days, setDays] = useState('3');

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useSize(elementRef);

  const { data: events, isLoading: isEventsLoading } = useStrategyEvents(strategy.id);

  const denom = isBuyStrategy(strategy) ? getStrategyResultingDenom(strategy) : getStrategyInitialDenom(strategy);

  const { data: coingeckoData, isLoading: isPriceLoading } = useFiatPriceHistory(denom, days);

  const now = new Date();
  const fromDate = new Date(now.getTime() - parseInt(days, 10) * 24 * 60 * 60 * 1000);

  const accumulatedDcaPlusEvents = convertDcaPlusEvents(events);

  const dcaPlusLineChartData = buildLineChartData(accumulatedDcaPlusEvents, fromDate, now);
  const dcaPlusSwapsChartData = buildSwapsChartData(accumulatedDcaPlusEvents, fromDate, now);

  const acculumatedTradEvents = convertTradEvents(events);

  const tradLineChartData = buildLineChartData(acculumatedTradEvents, fromDate, now);
  const tradSwapsChartData = buildSwapsChartData(acculumatedTradEvents, fromDate, now);

  const priceData = getPriceData(coingeckoData?.prices) || [];

  const lineChartMax = Math.max(getTotalReceived(strategy), getStandardDcaTotalReceived(strategy));

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
  const valueAxisStyle = {
    axis: { stroke: 'white' },
    tickLabels: { fill: 'white' },
  };
  const tradValueLineStyle = { data: { stroke: '#1A89EF' } };
  const tradValueScatterStyle = { data: { fill: '#1A89EF' } };

  const dcaPlusValueLineStyle = { data: { stroke: '#1AEFAF' } };
  const dcaPlusValueScatterStyle = { data: { fill: '#1AEFAF' } };

  return (
    <GridItem colSpan={6}>
      <Box layerStyle="panel" position="relative">
        {events && <StrategyComparisonChartStats strategy={strategy} />}
        <Stack p={6} position="absolute" top={0} right={0} display={{ base: 'none', lg: 'initial' }}>
          <DaysRadio value={days} onChange={setDays} />
        </Stack>
        <Stack pl={6} display={{ lg: 'none' }}>
          <DaysRadio value={days} onChange={setDays} />
        </Stack>

        <Center width="full" height={250} ref={elementRef} px={6}>
          {isPriceLoading || isEventsLoading ? (
            <Spinner />
          ) : (
            <VictoryChart
              height={dimensions?.height}
              width={dimensions?.width}
              containerComponent={<VictoryVoronoiContainer />}
              padding={{ left: 60, bottom: 40, top: 10, right: 80 }}
            >
              {/* Time Axis */}
              <VictoryAxis style={timeAxisStyle} tickFormat={formatTimeTick()} />
              {/* Value axis */}
              <VictoryAxis
                dependentAxis
                key={0}
                style={valueAxisStyle}
                tickFormat={(tick) => (tick * lineChartMax).toFixed(2)}
              />
              {/* Price axis */}
              <VictoryAxis
                dependentAxis
                key={2}
                style={priceAxisStyle}
                orientation="right"
                offsetX={80}
                tickFormat={formatPriceTick(priceMax)}
              />
              <VictoryLine
                key={2}
                data={priceData}
                style={priceLineStyle}
                y={(datum) => datum.amount / priceMax}
                x="date"
                labelComponent={<VictoryTooltip />}
                interpolation="stepBefore"
              />
              <VictoryLine
                key={0}
                data={tradLineChartData}
                style={tradValueLineStyle}
                y={(datum) => datum.amount / lineChartMax}
                x="time"
                interpolation="stepAfter"
                labelComponent={<VictoryTooltip />}
              />

              <VictoryScatter
                style={tradValueScatterStyle}
                size={5}
                data={tradSwapsChartData}
                x="time"
                y={(datum) => datum.amount / lineChartMax}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryLine
                key={0}
                data={dcaPlusLineChartData}
                style={dcaPlusValueLineStyle}
                y={(datum) => datum.amount / lineChartMax}
                x="time"
                interpolation="stepAfter"
                labelComponent={<VictoryTooltip />}
              />

              <VictoryScatter
                style={dcaPlusValueScatterStyle}
                size={5}
                data={dcaPlusSwapsChartData}
                x="time"
                y={(datum) => datum.amount / lineChartMax}
                labelComponent={<VictoryTooltip style={{ textAnchor: 'left' }} />}
              />
            </VictoryChart>
          )}
        </Center>
        <Center width="full" p={6}>
          <StrategyComparisonLegend denom={denom} />
        </Center>
      </Box>
    </GridItem>
  );
}
