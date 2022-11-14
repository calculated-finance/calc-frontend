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
import { VictoryArea, VictoryAxis, VictoryChart, VictoryTooltip, VictoryVoronoiContainer } from 'victory';
import { useRef, useState } from 'react';
import { Strategy } from '@hooks/useStrategies';
import useFiatPrice from '@hooks/useFiatPrice';
import { useSize } from 'ahooks';
import useFiatPriceHistory from '@hooks/useFiatPriceHistory';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getStrategyInitialDenom } from '../../../helpers/getStrategyInitialDenom';
import { formatFiat } from './StrategyPerformance';
import { getChartData } from './getChartData';

export function StrategyChart({ strategy }: { strategy: Strategy }) {
  const [days, setDays] = useState(1);

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useSize(elementRef);

  const { data: eventsData } = useStrategyEvents(strategy.id);

  const events = eventsData?.events;

  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const { price: resultingDenomPrice } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice } = useFiatPrice(initialDenom);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDays(Number(event.target.value));
  };

  const { data: coingeckoData } = useFiatPriceHistory(resultingDenom, days);

  const chartData = getChartData(events, coingeckoData);

  const marketValueAmount = strategy.received_amount.amount;

  const costAmount = strategy.swapped_amount.amount;

  const marketValueValue = new DenomValue({ amount: marketValueAmount, denom: resultingDenom });
  const costValue = new DenomValue({ amount: costAmount, denom: initialDenom });

  const costInFiat = costValue.toConverted() * initialDenomPrice;
  const marketValueInFiat = marketValueValue.toConverted() * resultingDenomPrice;

  const profit = marketValueInFiat - costInFiat;

  const percentageChange = `${(costInFiat ? (profit / costInFiat) * 100 : 0).toFixed(2)}%`;

  const color = profit > 0 ? 'green.200' : profit < 0 ? 'red.200' : 'white';

  return (
    <GridItem colSpan={6}>
      <Heading size="md" pb={4}>
        Strategy history
      </Heading>

      <Box layerStyle="panel" position="relative">
        <Stack spacing={3} pt={6} pl={6}>
          <Stat>
            <StatLabel fontSize="lg">Strategy market value</StatLabel>
            <StatNumber>
              {formatFiat(
                getDenomInfo(resultingDenom).conversion(Number(strategy.received_amount.amount) * resultingDenomPrice),
              )}
            </StatNumber>
            <StatHelpText color={color} m={0}>
              <StatArrow type={color === 'green.200' ? 'increase' : 'decrease'} />
              {formatFiat(profit)} : {percentageChange}
            </StatHelpText>
          </Stat>
        </Stack>
        <Box p={6} position="absolute" top={0} right={0}>
          <Select onChange={handleSelect} size="xs" variant="outline">
            <option value={1}>1D</option>
            <option value={3}>3D</option>
            <option value={7}>1W</option>
            <option value={30}>1M</option>
            <option value={90}>3M</option>
            <option value={365}>1Y</option>
          </Select>
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
          {!chartData ? (
            <Spinner />
          ) : (
            <VictoryChart
              height={dimensions?.height}
              width={dimensions?.width}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryAxis
                dependentAxis
                style={{
                  tickLabels: { fill: 'white' },
                }}
                tickFormat={(tick) =>
                  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tick)
                }
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
