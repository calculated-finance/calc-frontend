import { Box, Code, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import useSpotPrice from '@hooks/useSpotPrice';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { SummaryTriggerInfo } from './SummaryTriggerInfo';
import { IncrementAndInterval } from './IncrementAndInterval';

export function SummaryTheSwapWeightedScale({ state }: { state: WeightedScaleState }) {
  const { initialDenom, resultingDenom, swapAmount, swapMultiplier, basePriceValue } = state;

  const { transactionType } = useStrategyInfo();

  const { formattedPrice } = useSpotPrice(resultingDenom, initialDenom, transactionType);

  const priceOfDenom = transactionType === 'buy' ? resultingDenom : initialDenom;
  const priceInDenom = transactionType === 'buy' ? initialDenom : resultingDenom;

  const { name: priceOfDenomName } = priceOfDenom;
  const { name: priceInDenomName } = priceInDenom;

  return (
    <Box data-testid="summary-the-swap-weighted-scale">
      <Text textStyle="body-xs">The swap</Text>
      <Text lineHeight={8}>
        <SummaryTriggerInfo state={state} transactionType={transactionType} />, CALC will swap the amount of{' '}
        <BadgeButton url="customise">
          <Code color="none" bg="none">
            {swapAmount} {initialDenom.name}
          </Code>
          <DenomIcon denomInfo={initialDenom} />
          <Code color="none" bg="none">
            &times; (1 - price delta &times; {swapMultiplier})
          </Code>
        </BadgeButton>
        <br />
        Where price delta is calculated from the base price of
        <BadgeButton url="customise">
          <Text>
            1 {priceOfDenomName} = {basePriceValue || formattedPrice} {priceInDenomName}
          </Text>
        </BadgeButton>
        for{' '}
        <BadgeButton url="assets">
          <Text>{resultingDenom.name}</Text>
          <DenomIcon denomInfo={resultingDenom} />
        </BadgeButton>{' '}
        every <IncrementAndInterval state={state} />
      </Text>
    </Box>
  );
}
