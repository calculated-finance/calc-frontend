import { Box, Code, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
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

  const initialDenomInfo = getDenomInfo(initialDenom);
  const resultingDenomInfo = getDenomInfo(resultingDenom);

  const { chain } = useChain();
  const { formattedPrice } = usePrice(resultingDenomInfo, initialDenomInfo, transactionType);
  const { price: osmosisPrice } = usePriceOsmosis(
    resultingDenomInfo,
    initialDenomInfo,
    transactionType,
    chain === Chains.Osmosis,
  );

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
            1 {priceOfDenomName} = {basePriceValue || formattedPrice || osmosisPrice} {priceInDenomName}
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
