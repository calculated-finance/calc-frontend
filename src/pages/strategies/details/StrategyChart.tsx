import { GridItem, Box, Center } from '@chakra-ui/react';
import Spinner from '@components/Spinner';
import useStrategyEvents from '@hooks/useStrategyEvents';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
  VictoryTooltip,
  VictoryTooltipProps,
  VictoryVoronoiContainer,
} from 'victory';
import { useRef, useState } from 'react';
import { Strategy } from '@models/Strategy';
import { useSize } from 'ahooks';
import useFiatPriceHistory from '@hooks/useFiatPriceHistory';
import { getStrategyInitialDenom, getStrategyResultingDenom, isBuyStrategy } from '@helpers/strategy';
import useDenoms from '@hooks/useDenoms';
import { COIN_DECIMAL_LIMIT, COIN_DECIMAL_LIMIT_TO_SHOW_2_DECIMALS } from 'src/constants';
import { getChartData, getChartDataSwaps } from './getChartData';
import { StrategyChartStats } from './StrategyChartStats';
import { DaysRadio } from './DaysRadio';

function CustomLabel(props: VictoryTooltipProps) {
  return (
    <g>
      <VictoryTooltip
        {...props}
        flyoutStyle={{
          fill: '#1B202B',
          stroke: 'none',
          filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.25))',
        }}
        cornerRadius={10}
        style={{ fill: 'white', textAnchor: 'left', fontSize: 12 }}
        flyoutPadding={16}
      />
    </g>
  );
}

function roundedDisplay(amount: number | undefined) {
  if (!amount) {
    return '0';
  }

  const showLessThanAmount = amount < 10 ** -COIN_DECIMAL_LIMIT;
  const showMoreThanAmount = amount > 10 ** -COIN_DECIMAL_LIMIT_TO_SHOW_2_DECIMALS;

  if (showLessThanAmount) {
    return `<${10 ** -COIN_DECIMAL_LIMIT}`;
  }

  if (showMoreThanAmount) {
    return amount.toFixed(2);
  }

  return amount.toFixed(6);
}

export function StrategyChart({ strategy }: { strategy: Strategy }) {
  const [days, setDays] = useState('3');

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useSize(elementRef);

  const { data: events } = useStrategyEvents(strategy.id);

  const resultingDenom = getStrategyResultingDenom(strategy);
  const initialDenom = getStrategyInitialDenom(strategy);

  const { data: coingeckoData } = useFiatPriceHistory(resultingDenom, days);
  const { data: coingeckoDataInitialDenom } = useFiatPriceHistory(initialDenom, days);

  const displayPrices = isBuyStrategy(strategy) ? coingeckoData?.prices : coingeckoDataInitialDenom?.prices;
  const priceOfDenom = isBuyStrategy(strategy) ? resultingDenom : initialDenom;
  const priceInDenom = isBuyStrategy(strategy) ? initialDenom : resultingDenom;

  const { name: priceOfDenomName } = priceOfDenom;
  const { name: priceInDenomName } = priceInDenom;

  const { allDenoms } = useDenoms();

  if (!allDenoms) {
    return (
      <Center width="full" height={250} ref={elementRef} px={6}>
        <Spinner />
      </Center>
    );
  }

  const chartData = getChartData(events, coingeckoData?.prices, displayPrices, allDenoms);
  const swapsData = getChartDataSwaps(events, coingeckoData?.prices, displayPrices, allDenoms);

  const swapsFailedDataWithLabel = swapsData
    ?.filter((swap) => swap?.event.type === 'dca_vault_execution_skipped')
    ?.map((swap) => ({
      ...swap,
      label: `${swap?.event.failed}. \nDate: ${swap?.date
        .toLocaleDateString('en-AU', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        })
        .replace(',', '')}\n1 ${priceOfDenomName} = ${Number(swap?.currentPrice).toFixed(2)}USD\n\nBlock Height: ${
        swap?.blockHeight
      }\n`,
    }));

  const swapsDataWithLabel = swapsData
    ?.filter((swap) => swap?.event.type === 'dca_vault_execution_completed')
    .map((swap) => ({
      ...swap,
      label: `${
        isBuyStrategy(strategy)
          ? `${priceInDenomName} ➡️ ${priceOfDenomName}`
          : `${priceOfDenomName} ➡️ ${priceInDenomName}`
      }\nSwapped: ${
        isBuyStrategy(strategy)
          ? `${roundedDisplay(swap?.event.denomAmountSent)} ${priceInDenomName}`
          : `${roundedDisplay(swap?.event.denomAmountSent)} ${priceOfDenomName}`
      }  ➡️  ${roundedDisplay(swap?.event.swapAmount)} ${swap?.event.swapDenom}\nAccumulated: ${roundedDisplay(
        swap?.event.accumulation,
      )} ${swap?.event.swapDenom}\nDate: ${swap?.date
        .toLocaleDateString('en-AU', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        })
        .replace(',', '')}\n\nBlock Height: ${swap?.blockHeight}\n1 ${priceOfDenomName} = ${Number(
        swap?.currentPrice,
      ).toFixed(2)}USD`,
    }));

  return (
    <GridItem colSpan={6}>
      <Box layerStyle="panel" position="relative">
        {events && <StrategyChartStats strategy={strategy} />}
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
                style={{
                  data: { fill: 'black', stroke: 'black', strokeWidth: 1 },
                  labels: { fill: 'white', fontSize: 6 },
                }}
                size={6}
                data={swapsFailedDataWithLabel}
                x="date"
                y="marketValue"
                symbol="diamond"
                labelComponent={<CustomLabel />}
              />
              <VictoryScatter
                style={{
                  data: { fill: '#1AEFAF', stroke: 'white', strokeWidth: 1 },
                  labels: { fill: 'white', fontSize: 6 },
                }}
                size={6}
                data={swapsDataWithLabel}
                x="date"
                y="marketValue"
                labelComponent={<CustomLabel />}
              />
              <VictoryArea
                style={{
                  data: { stroke: '#1AEFAF', fillOpacity: '10%', fill: 'url(#myGradient)', strokeWidth: 2 },
                }}
                data={chartData}
                standalone={false}
                labelComponent={<CustomLabel />}
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
