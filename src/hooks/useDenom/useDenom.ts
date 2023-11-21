import { useChainId } from '@hooks/useChainId';
import getDenomInfo from '@utils/getDenomInfo';
import { useMemo } from 'react';

export function useDenom(denom: string | undefined) {
  const chain = useChainId();
  const denomInfo = useMemo(() => getDenomInfo(denom), [denom, chain]);
  return denomInfo;
}
