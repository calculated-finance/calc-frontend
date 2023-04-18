import { useOsmosisPools } from '@hooks/useOsmosisPools';
import { Chains, useChain } from '@hooks/useChain';
import { FIN_TAKER_FEE } from 'src/constants';

export default function useDexFee(route: number[]) {
  const { chain } = useChain();
  const { data: pools } = useOsmosisPools(chain === Chains.Osmosis);
  if (chain === Chains.Kujira) {
    return { dexFee: FIN_TAKER_FEE };
  }

  if (route) {
    if (route.length === 1) {
      const pool = pools?.find((p) => p.id.toNumber() === route[0]);
      const swapFee = Number(pool?.poolParams?.swapFee) / 10 ** 18;
      return { dexFee: swapFee };
    }
    let osmoCount = 0;
    const dexFee = route.reduce((totalFee, poolId) => {
      const pool = pools?.find((p) => p.id.toNumber() === poolId);
      const swapFee = Number(pool?.poolParams?.swapFee) / 10 ** 18;
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

  return { dexFee: 0.2 / 100 };
}
