import { useChainId } from '@hooks/useChainId';
import { FIN_TAKER_FEE } from 'src/constants';
import { TransactionType } from '@components/TransactionType';
import { findPair } from '@helpers/findPair';
import usePairs from '@hooks/usePairs';
import { DenomInfo } from '@utils/DenomInfo';

export default function useDexFee(
  initialDenom: DenomInfo,
  resultingDenom: DenomInfo,
  transactionType: TransactionType,
) {
  const { chainId } = useChainId();
  const { pairs } = usePairs();

  if (['kaiyo-1', 'harpoon-4'].includes(chainId)) {
    return { dexFee: FIN_TAKER_FEE };
  }

  const pair =
    pairs && resultingDenom && initialDenom
      ? findPair(
          pairs,
          transactionType === TransactionType.Buy ? resultingDenom : initialDenom,
          transactionType === TransactionType.Buy ? initialDenom : resultingDenom,
        )
      : null;

  if (!pair) {
    return { dexFee: 0 };
  }

  return { dexFee: 0 };
}
