import useDenoms from '@hooks/useDenoms';
import { useMemo } from 'react';

export function useDenom(denom: string | undefined) {
  const { getDenomInfo } = useDenoms();
  return useMemo(() => (denom ? getDenomInfo(denom) : undefined), [denom]);
}
