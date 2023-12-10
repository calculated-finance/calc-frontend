import { DenomInfo } from '@utils/DenomInfo';
import { Coin } from '@cosmjs/stargate';
import getDenomInfo from '@utils/getDenomInfo';
import useExpectedReceiveAmount from './useExpectedReceiveAmount';

export default function useExpectedPrice(
  swapAmount: Coin | undefined,
  targetDenom: DenomInfo | undefined,
  route?: string,
  enabled = true,
) {
  const { expectedReceiveAmount, ...helpers } = useExpectedReceiveAmount(swapAmount, targetDenom, route, enabled);

  const expectedPrice =
    swapAmount &&
    targetDenom &&
    expectedReceiveAmount &&
    getDenomInfo(swapAmount.denom).conversion(Number(swapAmount.amount)) /
      targetDenom.conversion(Number(expectedReceiveAmount.amount));

  return {
    expectedPrice,
    ...helpers,
  };
}
