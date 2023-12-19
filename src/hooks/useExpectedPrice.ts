import { DenomInfo } from '@utils/DenomInfo';
import { Coin } from '@cosmjs/stargate';
import useExpectedReceiveAmount from './useExpectedReceiveAmount';
import useDenoms from './useDenoms';
import { fromAtomic } from '@utils/getDenomInfo';

export default function useExpectedPrice(
  swapAmount: Coin | undefined,
  targetDenom: DenomInfo | undefined,
  route?: string,
  enabled = true,
) {
  const { getDenomInfo } = useDenoms();
  const { expectedReceiveAmount, ...helpers } = useExpectedReceiveAmount(swapAmount, targetDenom, route, enabled);

  const initialDenom = swapAmount && getDenomInfo(swapAmount.denom);

  const expectedPrice =
    swapAmount &&
    targetDenom &&
    expectedReceiveAmount &&
    initialDenom &&
    fromAtomic(initialDenom, Number(swapAmount.amount)) / fromAtomic(targetDenom, Number(expectedReceiveAmount.amount));

  return {
    expectedPrice,
    ...helpers,
  };
}
