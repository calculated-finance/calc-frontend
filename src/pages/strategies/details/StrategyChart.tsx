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
  useRadioGroup,
  HStack,
} from '@chakra-ui/react';
import Spinner from '@components/Spinner';
import getDenomInfo, { DenomValue } from '@utils/getDenomInfo';
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
import useFiatPrice from '@hooks/useFiatPrice';
import { useSize } from 'ahooks';
import useFiatPriceHistory from '@hooks/useFiatPriceHistory';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';
import { FIN_TAKER_FEE, SWAP_FEE } from 'src/constants';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getStrategyInitialDenom } from '../../../helpers/getStrategyInitialDenom';
import { formatFiat } from './StrategyPerformance';
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

export function StrategyChart({ strategy }: { strategy: Strategy }) {
  const [days, setDays] = useState('3');

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useSize(elementRef);

  const { data: eventsData } = useStrategyEvents(strategy.id);

  const events = eventsData?.events;

  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const { price: resultingDenomPrice } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice } = useFiatPrice(initialDenom);

  const { data: coingeckoData } = useFiatPriceHistory(resultingDenom, days);

  const chartData = getChartData(events, coingeckoData);
  const swapsData = getChartDataSwaps(events, coingeckoData, true);

  const marketValueAmount = strategy.received_amount.amount;

  const costAmount = strategy.swapped_amount.amount;
  const costAmountWithFeesSubtracted = Number(costAmount) - Number(costAmount) * (SWAP_FEE + FIN_TAKER_FEE);

  const marketValueValue = new DenomValue({ amount: marketValueAmount, denom: resultingDenom });
  const costValue = new DenomValue({ amount: costAmountWithFeesSubtracted.toString(), denom: initialDenom });

  const costInFiat = Number((costValue.toConverted() * initialDenomPrice).toFixed(2));
  const marketValueInFiat = Number((marketValueValue.toConverted() * resultingDenomPrice).toFixed(2));

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
