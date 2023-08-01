import { MINIMUM_SWAP_VALUE_IN_USD } from 'src/constants';
import { formatFiat } from './format/formatFiat';

export function checkSwapAmountValue(swapAmountValue: number) {
  if (!(swapAmountValue >= MINIMUM_SWAP_VALUE_IN_USD)) {
    throw new Error(`Minimum swap amount must be greater than ${formatFiat(MINIMUM_SWAP_VALUE_IN_USD)}`);
  }
}
