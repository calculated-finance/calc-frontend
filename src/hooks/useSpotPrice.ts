import { max } from 'lodash';
import { TransactionType } from '@components/TransactionType';
import { DenomInfo } from '@utils/DenomInfo';
import { safeInvert } from '@utils/safeInvert';
import useTwapToNow from '@hooks/useTwapToNow';

export default function useSpotPrice(
  resultingDenom: DenomInfo | undefined,
  initialDenom: DenomInfo | undefined,
  transactionType: TransactionType,
  route: string | null | undefined,
  enabled = true,
) {
  const { twap, ...helpers } = useTwapToNow(initialDenom, resultingDenom, route, enabled);

  const spotPrice = twap && transactionType === TransactionType.Sell ? safeInvert(twap) : twap;
  const pricePrecision = max([initialDenom?.pricePrecision || 0, resultingDenom?.pricePrecision || 0]);

  const formattedPrice = spotPrice
    ? spotPrice.toLocaleString('en-US', {
        maximumFractionDigits: pricePrecision || 3,
        minimumFractionDigits: 3,
      })
    : undefined;

  return {
    formattedPrice,
    spotPrice,
    ...helpers,
  };
}
