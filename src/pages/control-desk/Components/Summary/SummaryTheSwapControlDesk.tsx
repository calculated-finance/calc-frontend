import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { useDenom } from '@hooks/useDenom/useDenom';
import YesNoValues from '@models/YesNoValues';
import { CtrlFormDataAll } from '../ControlDeskForms';

// function getOnceOffPaymentSwapSpread(totalCollateralisedAmount: number, collateralisedMultiplier: number) {

//   const min = (MIN_OVER_COLATERALISED * totalCollateralisedAmount).toFixed(2)
//   const max = (collateralisedMultiplier * totalCollateralisedAmount).toFixed(2)

//   const spreadSummary = `${min} - ${max}`

//   return spreadSummary

// }

export function SummaryTheSwapControlDesk({ state, transactionType }: { state: CtrlFormDataAll; transactionType: string }) {
  const { initialDenom, resultingDenom, calcCalculatedSwapsEnabled, totalCollateralisedAmount, collateralisedMultiplier, targetAmount } = state;
  const initialDenomInfo = useDenom(initialDenom);
  const resultingDenomInfo = useDenom(resultingDenom);

  // const spread = getOnceOffPaymentSwapSpread(totalCollateralisedAmount, collateralisedMultiplier)


  return (
    <Box data-testid="summary-the-swap">
      <Text textStyle="body-xs">The swap</Text>
      <Text lineHeight={8}>
        Starting immediately, CALC will swap the amount of
        <BadgeButton url="customise">
          <Text>
            {String.fromCharCode(8275)} 5 - 10 {initialDenomInfo.name}
          </Text>
          <DenomIcon denomInfo={initialDenomInfo} />
        </BadgeButton>{' '}
        every{' '}
        {calcCalculatedSwapsEnabled === YesNoValues.Yes ? <BadgeButton url="customise"><Text>10 minutes</Text></BadgeButton> :
          'Custom Interval Increment details'
        }{' '}
        until <BadgeButton url="assets">
          <Text>{targetAmount} {resultingDenomInfo.name}</Text>
          <DenomIcon denomInfo={resultingDenomInfo} />
        </BadgeButton>{' '} is reached.
      </Text>
    </Box>
  );
}
