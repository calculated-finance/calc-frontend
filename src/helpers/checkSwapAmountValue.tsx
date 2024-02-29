import { ChainId } from '@models/ChainId';
import { formatFiat } from './format/formatFiat';
import { getChainMinimumSwapValue } from './chains';

export function checkSwapAmountValue(chainId: ChainId, swapAmount: number, price: number) {
  const swapAmountValue = swapAmount * price;
  const minimumSwapAmount = getChainMinimumSwapValue(chainId);
  if (!(swapAmountValue >= minimumSwapAmount)) {
    throw new Error(`Minimum swap amount must be greater than ${formatFiat(minimumSwapAmount)}`);
  }
}
