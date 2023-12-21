import { isNumber } from 'lodash';

export function safeInvert(value: number) {
  if (!value) {
    return 0;
  }

  if (!isNumber(value)) {
    return 0;
  }

  return 1 / value;
}
