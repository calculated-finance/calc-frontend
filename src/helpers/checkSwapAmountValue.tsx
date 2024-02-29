import { MINIMUM_SWAP_VALUE_IN_USD } from 'src/constants';
import { ChainId } from '@models/ChainId';
import { formatFiat } from './format/formatFiat';
import { getChainMinimumSwapValue } from './chains';

export function checkSwapAmountValue(chainId: ChainId, swapAmount: number, price: number) {
  const swapAmountValue = swapAmount * price;
  if (!(swapAmountValue >= getChainMinimumSwapValue(chainId))) {
    throw new Error(`Minimum swap amount must be greater than ${formatFiat(MINIMUM_SWAP_VALUE_IN_USD)}`);
  }
}
