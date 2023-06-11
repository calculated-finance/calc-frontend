import { isNaN } from 'lodash';

export function formatFiat(value: number | undefined) {
  if (value === undefined) {
    return '';
  }
  const roundedValue = Math.round(value * 100) / 100;
  return `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    minimumFractionDigits: 2,
    maximumFractionDigits: roundedValue < 0.1 ? 4 : 2,
    currency: 'USD',
  }).format(!isNaN(value) ? value : 0)} USD`;
}
