import useDenoms from '@hooks/useDenoms';
import { useMemo } from 'react';

export function useDenom(denom: string | undefined) {
  const { getDenomById } = useDenoms();
  return useMemo(() => (denom ? getDenomById(denom) : undefined), [denom]);
}
