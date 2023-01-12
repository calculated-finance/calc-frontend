import {
  Heading,
  GridItem,
  Box,
  Center,
  Stat,
  StatNumber,
  Stack,
  StatLabel,
  StatHelpText,
  StatArrow,
  useRadioGroup,
  HStack,
} from '@chakra-ui/react';
import Spinner from '@components/Spinner';
import useStrategyEvents, { StrategyEvent } from '@hooks/useStrategyEvents';
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
import useFiatPrice from '@hooks/useFiatPrice';
import { useSize } from 'ahooks';
import useFiatPriceHistory from '@hooks/useFiatPriceHistory';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';
import { getStrategyType } from 'src/helpers/getStrategyType';
import { StrategyTypes } from '@models/StrategyTypes';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getStrategyInitialDenom } from '../../../helpers/getStrategyInitialDenom';
import { formatFiat } from './StrategyPerformance';
import { getPerformanceStatistics } from './getPerformanceStatistics';
import { getChartData, getChartDataSwaps } from './getChartData';

const daysData = [
  { value: '1', label: '1D' },
  { value: '3', label: '3D' },
  { value: '7', label: '1W' },
  { value: '30', label: '1M' },
  { value: '90', label: '3M' },
  { value: '365', label: '1Y' },
];

function DaysRadio({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    value,
    onChange,
  });

  return (
    <HStack spacing={0}>
      <Radio {...getRootProps} px={0}>
        {daysData.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <RadioCard key={option.label} {...radio}>
              {option.label}
            </RadioCard>
          );
        })}
      </Radio>
    </HStack>
  );
}

function StrategyChartStats({ strategy, strategyEvents }: { strategy: Strategy; strategyEvents: StrategyEvent[] }) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const { price: resultingDenomPrice } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice } = useFiatPrice(initialDenom);

  const { color, percentageChange, profit, marketValueInFiat } = getPerformanceStatistics(
    strategy,
    initialDenomPrice,
    resultingDenomPrice,
    strategyEvents,
  );
  return (
    <Stack spacing={3} pt={6} pl={6}>
      <Stat>
        <StatLabel fontSize="lg">Strategy market value</StatLabel>
        <StatNumber>{formatFiat(marketValueInFiat)}</StatNumber>
        {getStrategyType(strategy) === StrategyTypes.DCAIn && (
          <StatHelpText color={color} m={0}>
            <StatArrow type={color === 'green.200' ? 'increase' : 'decrease'} />
            {formatFiat(profit)} : {percentageChange}
          </StatHelpText>
        )}
      </Stat>
    </Stack>
  );
}

export function StrategyChart({ strategy }: { strategy: Strategy }) {
  const [days, setDays] = useState('3');

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useSize(elementRef);

  const { data: eventsData } = useStrategyEvents(strategy.id);

  const events = eventsData?.events;

  const resultingDenom = getStrategyResultingDenom(strategy);

  const { data: coingeckoData } = useFiatPriceHistory(resultingDenom, days);

  const chartData = getChartData(events, coingeckoData?.prices);
  const swapsData = getChartDataSwaps(events, coingeckoData?.prices, true);

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
