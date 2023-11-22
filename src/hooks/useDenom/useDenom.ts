import getDenomInfo from '@utils/getDenomInfo';
import { useMemo } from 'react';

export function useDenom(denom: string | undefined) {
  return useMemo(() => getDenomInfo(denom), [denom]);
}
