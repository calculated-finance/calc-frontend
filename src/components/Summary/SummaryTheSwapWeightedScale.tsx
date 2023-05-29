import { Box, Code, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { Chains, useChain } from '@hooks/useChain';
import usePrice from '@hooks/usePrice';
import usePriceOsmosis from '@hooks/usePriceOsmosis';
import { TransactionType } from '@components/TransactionType';
import { SummaryTriggerInfo } from './SummaryTriggerInfo';
import { IncrementAndInterval } from './IncrementAndInterval';

export function SummaryTheSwapWeightedScale({
  state,
  transactionType,
}: {
  state: WeightedScaleState;
  transactionType: TransactionType;
}) {
  const { initialDenom, resultingDenom, swapAmount, swapMultiplier, basePriceValue } = state;

  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

  const { chain } = useChain();
  const { price } = usePrice(resultingDenom, initialDenom, transactionType);
  const { price: osmosisPrice } = usePriceOsmosis(
    resultingDenom,
    initialDenom,
    transactionType,
    chain === Chains.Osmosis,
  );

  const priceOfDenom = transactionType === 'buy' ? resultingDenom : initialDenom;
  const priceInDenom = transactionType === 'buy' ? initialDenom : resultingDenom;

  const { name: priceOfDenomName } = getDenomInfo(priceOfDenom);
  const { name: priceInDenomName } = getDenomInfo(priceInDenom);

  return (
    <Box data-testid="summary-the-swap-weighted-scale">
      <Text textStyle="body-xs">The swap</Text>
      <Text lineHeight={8}>
        <SummaryTriggerInfo state={state} transactionType={transactionType} />, CALC will swap the amount of{' '}
        <BadgeButton url="customise">
          <Code color="none" bg="none">
            {swapAmount} {initialDenomName}
          </Code>
          <DenomIcon denomName={initialDenom} />
          <Code color="none" bg="none">
            &times; (1 - price delta &times; {swapMultiplier})
          </Code>
        </BadgeButton>
        <br />
        Where price delta is calculated from the base price of
        <BadgeButton url="customise">
          <Text>
            1 {priceOfDenomName} = {basePriceValue || price || osmosisPrice} {priceInDenomName}
          </Text>
        </BadgeButton>
        for{' '}
        <BadgeButton url="assets">
          <Text>{resultingDenomName}</Text>
          <DenomIcon denomName={resultingDenom} />
        </BadgeButton>{' '}
        every <IncrementAndInterval state={state} />
      </Text>
    </Box>
  );
}
