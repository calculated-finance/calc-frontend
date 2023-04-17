import { TransactionType } from '@components/TransactionType';
import { findPair } from '@helpers/findPair';
import { Denom } from '@models/Denom';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useOsmosis } from '@hooks/useOsmosis';
import Long from 'long';
import { safeInvert } from '@hooks/usePrice';
import { Pair as OsmosisPair } from 'src/interfaces/generated-osmosis/response/get_vault';
import { useOsmosisPools } from '@hooks/useOsmosisPools';
import { Pool } from 'osmojs/types/codegen/osmosis/gamm/pool-models/balancer/balancerPool';
import { Chains, useChain } from '@hooks/useChain';
import { FIN_TAKER_FEE } from 'src/constants';
import useQueryWithNotification from '../useQueryWithNotification';
import usePairs from '../usePairs';

// interface Step {
//   poolId: Long;
//   tokenOutDenom: string;
// }

// function findRoute(poolIds: number[], initialDenom: string, poolList: Pool[]): Step[] {
//   let tokenInDenom = initialDenom;

//   const steps = poolIds.reduce((acc: Step[], poolId) => {
//     const pool = poolList.find((p) => p.id.toNumber() === poolId);

//     if (!pool) {
//       throw new Error(`Pool with id ${poolId} not found.`);
//     }

//     const { poolAssets } = pool;

//     const tokenOutDenomObj = poolAssets.find((asset) => asset.token?.denom !== tokenInDenom);

//     if (tokenOutDenomObj) {
//       const tokenOutDenom = tokenOutDenomObj.token?.denom;
//       acc.push({ poolId: Long.fromNumber(poolId, true), tokenOutDenom: tokenOutDenom! });
//       tokenInDenom = tokenOutDenom!;
//     }

//     return acc;
//   }, []);

//   return steps;
// }

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
  // const client = useCosmWasmClient((state) => state.client);
  // const query = useOsmosis((state) => state.query);

  // const { data: pools, isLoading: isLoadingPools } = useOsmosisPools(enabled);

  // const { data: pairsData } = usePairs();
  // const { pairs } = pairsData || {};
  // const pair =
  //   pairs && resultingDenom && initialDenom
  //     ? findPair(
  //         pairs,
  //         transactionType === TransactionType.Buy ? resultingDenom : initialDenom,
  //         transactionType === TransactionType.Buy ? initialDenom : resultingDenom,
  //       )
  //     : null;

  // const {
  //   data,
  //   isLoading: isPriceLoading,
  //   ...helpers
  // } = useQueryWithNotification<{ tokenOutAmount: string }>(
  //   ['price-osmosis', pair, client],
  //   async () => {
  //     const osmosisPair = pair as OsmosisPair;
  //     const route = transactionType === TransactionType.Buy ? osmosisPair.route : osmosisPair.route.reverse();
  //     const result = query.osmosis.poolmanager.v1beta1.estimateSwapExactAmountIn({
  //       poolId: new Long(0),
  //       tokenIn: `1000000${initialDenom}`,
  //       routes: findRoute(route, initialDenom!, pools!),
  //     });
  //     return result;
  //   },
  //   {
  //     enabled: !!client && !!pair && !!enabled && !!pools,
  //   },
  // );

  // const price =
  //   data &&
  //   (transactionType === TransactionType.Buy
  //     ? 1000000 / Number(data.tokenOutAmount)
  //     : safeInvert(1000000 / Number(data.tokenOutAmount)));

  // const formattedPrice = price
  //   ? price.toLocaleString('en-US', {
  //       maximumFractionDigits: 3,
  //       minimumFractionDigits: 3,
  //     })
  //   : undefined;

  // return {
  //   price: formattedPrice,
  //   pairAddress: pair?.address,
  //   isLoading: isPriceLoading || isLoadingPools,
  //   ...helpers,
  // };
}
