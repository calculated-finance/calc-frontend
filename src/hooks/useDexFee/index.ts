import { useChainId } from '@hooks/useChainId';
import { FIN_TAKER_FEE } from 'src/constants';

export default function useDexFee() {
  const { chainId } = useChainId();

  if (['kaiyo-1'].includes(chainId)) {
    return { dexFee: FIN_TAKER_FEE };
  }

  return { dexFee: 0.003 };
}
