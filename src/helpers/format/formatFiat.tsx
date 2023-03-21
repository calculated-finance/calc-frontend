import { isNaN } from 'lodash';

export function formatFiat(value: number) {
  return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    !isNaN(value) ? value : 0,
  )} USD`;
}
