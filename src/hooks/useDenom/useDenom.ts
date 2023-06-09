import { useChain } from '@hooks/useChain';
import getDenomInfo from '@utils/getDenomInfo';
import { useMemo } from 'react';

export function useDenom(denom: string | undefined) {
  const chain = useChain();
  const denomInfo = useMemo(() => getDenomInfo(denom), [denom, chain]);
  return denomInfo;
}
