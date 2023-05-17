import { Box, Code, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { SummaryTriggerInfo } from './SummaryTriggerInfo';

export function SummaryTheSwapWeightedScale({
  state,
  transactionType,
}: {
  state: WeightedScaleState;
  transactionType: string;
}) {
  const { initialDenom, resultingDenom, swapAmount, swapMultiplier, basePriceValue, executionInterval } = state;

  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

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
          {basePriceValue ? (
            <Text>
              1 {resultingDenomName} = {basePriceValue} {initialDenomName}
            </Text>
          ) : (
            <Text>current price</Text>
          )}
        </BadgeButton>
        for{' '}
        <BadgeButton url="assets">
          <Text>{resultingDenomName}</Text>
          <DenomIcon denomName={resultingDenom} />
        </BadgeButton>{' '}
        every{' '}
        <BadgeButton url="customise">
          <Text textTransform="capitalize">{executionIntervalDisplay[executionInterval as ExecutionIntervals][0]}</Text>
        </BadgeButton>
        , based on market conditions until the deposit is empty.
      </Text>
    </Box>
  );
}
