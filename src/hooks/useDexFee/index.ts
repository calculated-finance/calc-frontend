import { useOsmosisPools } from '@hooks/useOsmosisPools';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import { FIN_TAKER_FEE } from 'src/constants';
import { TransactionType } from '@components/TransactionType';
import { findPair } from '@helpers/findPair';
import usePairs from '@hooks/usePairs';
import { OsmosisPair } from '@models/Pair';

export default function useDexFee(
  initialDenom: string | undefined,
  resultingDenom: string | undefined,
  transactionType: TransactionType,
) {
  const { chain } = useChain();
  const { data: pairsData } = usePairs();
  const { data: pools } = useOsmosisPools(chain === Chains.Osmosis);

  if (chain === Chains.Kujira) {
    return { dexFee: FIN_TAKER_FEE };
  }

  const { pairs } = pairsData || {};

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

  if (pair && 'route' in pair) {
    const route = (pair as OsmosisPair)?.route;
    if (route) {
      if (route.length === 1) {
        const pool = pools?.find((p) => p.id.toNumber() === route[0]);
        const swapFee = Number(pool?.poolParams?.swapFee || 0) / 10 ** 18;
        return { dexFee: swapFee };
      }
      let osmoCount = 0;
      const dexFee = route.reduce((totalFee, poolId) => {
        const pool = pools?.find((p) => p.id.toNumber() === poolId);
        const swapFee = Number(pool?.poolParams?.swapFee || 0) / 10 ** 18;
        const assets = pool?.poolAssets;

        if (assets?.find((asset) => asset.token?.denom === 'uosmo')) {
          osmoCount += 1;
        }
        return totalFee + swapFee;
      }, 0);
      if (osmoCount >= 2) {
        return { dexFee: dexFee * 0.5 };
      }
      return { dexFee };
    }
  }

  return { dexFee: 0 };
}
