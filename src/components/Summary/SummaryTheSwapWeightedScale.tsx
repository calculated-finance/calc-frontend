import { Box, Code, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import usePrice from '@hooks/usePrice';
import { useDenom } from '@hooks/useDenom/useDenom';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { SummaryTriggerInfo } from './SummaryTriggerInfo';
import { IncrementAndInterval } from './IncrementAndInterval';

export function SummaryTheSwapWeightedScale({ state }: { state: WeightedScaleState }) {
  const { initialDenom, resultingDenom, swapAmount, swapMultiplier, basePriceValue } = state;

  const { transactionType } = useStrategyInfo();

  const initialDenomInfo = useDenom(initialDenom);
  const resultingDenomInfo = useDenom(resultingDenom);

  const { formattedPrice } = usePrice(resultingDenomInfo, initialDenomInfo, transactionType);

  const priceOfDenom = transactionType === 'buy' ? resultingDenomInfo : initialDenomInfo;
  const priceInDenom = transactionType === 'buy' ? initialDenomInfo : resultingDenomInfo;

  const { name: priceOfDenomName } = priceOfDenom;
  const { name: priceInDenomName } = priceInDenom;

  return (
    <Box data-testid="summary-the-swap-weighted-scale">
      <Text textStyle="body-xs">The swap</Text>
      <Text lineHeight={8}>
        <SummaryTriggerInfo state={state} transactionType={transactionType} />, CALC will swap the amount of{' '}
        <BadgeButton url="customise">
          <Code color="none" bg="none">
            {swapAmount} {initialDenomInfo.name}
          </Code>
          <DenomIcon denomInfo={initialDenomInfo} />
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
          <Text>{resultingDenomInfo.name}</Text>
          <DenomIcon denomInfo={resultingDenomInfo} />
        </BadgeButton>{' '}
        every <IncrementAndInterval state={state} />
      </Text>
    </Box>
  );
}
