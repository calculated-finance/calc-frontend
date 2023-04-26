import { GridItem, Box, Center } from '@chakra-ui/react';
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
import { formatFiat } from '@helpers/format/formatFiat';
import { TransactionType } from '@components/TransactionType';
import getDenomInfo from '@utils/getDenomInfo';
import { getStrategyInitialDenom, getStrategyResultingDenom, isBuyStrategy } from '@helpers/strategy';
import { getChartData, getChartDataSwaps } from './getChartData';
import { StrategyChartStats } from './StrategyChartStats';
import { DaysRadio } from './DaysRadio';

export function StrategyChart(
  { strategy }: { strategy: Strategy },
  { transactionType }: { transactionType: TransactionType },
) {
  const [days, setDays] = useState('3');

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useSize(elementRef);

  const { data: events } = useStrategyEvents(strategy.id);

  const resultingDenom = getStrategyResultingDenom(strategy);
  const initialDenom = getStrategyInitialDenom(strategy);

  const { data: coingeckoData } = useFiatPriceHistory(resultingDenom, days);
  const { data: coingeckoDataInitialDenom } = useFiatPriceHistory(initialDenom, days);

  const displayPrices = isBuyStrategy(strategy) ? coingeckoData?.prices : coingeckoDataInitialDenom?.prices;

  const priceOfDenom = transactionType === 'buy' ? resultingDenom : initialDenom;
  const priceInDenom = transactionType === 'buy' ? initialDenom : resultingDenom;

  const { name: priceOfDenomName } = getDenomInfo(priceOfDenom);
  const { name: priceInDenomName } = getDenomInfo(priceInDenom);

  const chartData = getChartData(events, coingeckoData?.prices, displayPrices);
  const swapsData = getChartDataSwaps(events, coingeckoData?.prices, displayPrices);

  const swapsDataWithLabel = swapsData?.map((swap) => ({
    ...swap,
    label: `${priceOfDenomName} ➡️ ${priceInDenomName} \n Accumulated: ${swap?.event.accumulation.toFixed(2)} ${
      swap?.event.swapDenom
    } \n 
       Date: ${swap?.date
         .toLocaleDateString('en-AU', {
           day: '2-digit',
           month: 'short',
           year: '2-digit',
         })
         .replace(',', '')} \n 1 ${priceInDenomName}  = ${formatFiat(swap?.currentPrice || 0)}
         `,
  }));

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
                data={swapsDataWithLabel}
                x="date"
                y="marketValue"
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
                y="marketValue"
              />
            </VictoryChart>
          )}
        </Center>
      </Box>
    </GridItem>
  );
}
