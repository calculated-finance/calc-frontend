import { reverse } from 'rambda';
import { TransactionType } from '@components/TransactionType';
import { findPair } from '@helpers/findPair';
import { useOsmosis } from '@hooks/useOsmosis';
import Long from 'long';
import { useOsmosisPools } from '@hooks/useOsmosisPools';
import { Pool } from 'osmojs/types/codegen/osmosis/gamm/pool-models/balancer/balancerPool';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { V2Pair } from '@models/Pair';
import usePairs, { usePairsOsmosis } from '../usePairs';

interface Step {
  poolId: Long;
  tokenOutDenom: string;
}

function findRoute(poolIds: number[], initialDenomId: string, poolList: Pool[]): Step[] {
  let tokenInDenom = initialDenomId;

  const steps = poolIds.reduce((acc: Step[], poolId) => {
    const pool = poolList.find((p) => p.id.toNumber() === poolId);

    if (!pool) {
      throw new Error(`Pool with id ${poolId} not found.`);
    }

    const { poolAssets } = pool;

    const tokenOutDenomObj = poolAssets.find((asset) => asset.token?.denom !== tokenInDenom);

    if (tokenOutDenomObj) {
      const tokenOutDenom = tokenOutDenomObj.token?.denom;
      acc.push({ poolId: Long.fromNumber(poolId, true), tokenOutDenom: tokenOutDenom! });
      tokenInDenom = tokenOutDenom!;
    }

    return acc;
  }, []);

  return steps;
}

export default function usePriceOsmosis(
  resultingDenom: DenomInfo | undefined,
  initialDenom: DenomInfo | undefined,
  transactionType: TransactionType,
  enabled: boolean,
) {
  const query = useOsmosis((state) => state.query);

  const { data: pools, isLoading: isLoadingPools } = useOsmosisPools(enabled);

  const { data: pairsData } = usePairsOsmosis();
  const { pairs } = pairsData || {};

  const {
    data,
    isLoading: isPriceLoading,
    ...helpers
  } = useQuery<{ price: number }>(
    ['price-osmosis', initialDenom, resultingDenom],
    async () => {
      if (!resultingDenom || !initialDenom) {
        throw new Error('Denoms not found');
      }

      const pair = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

      const route = pair && 'route' in pair ? (pair as V2Pair).route : undefined;

      const isRouteReversed = pair && 'quote_denom' in pair && initialDenom.id !== pair.quote_denom;

      const { significantFigures: initialSF } = initialDenom;
      const { significantFigures: resultingSF } = resultingDenom;

      const difference = initialSF - resultingSF;
      const factor = 10 ** initialSF;
      if (!route) {
        throw new Error('Route not found');
      }

      if (!pools) {
        throw new Error('Pools not found');
      }
      const directionalRoute = isRouteReversed ? reverse(route) : route;
      const result = await query.osmosis.poolmanager.v1beta1.estimateSwapExactAmountIn({
        poolId: new Long(0),
        tokenIn: `${factor}${initialDenom.id}`,
        routes: findRoute(directionalRoute, initialDenom.id, pools),
      });
      const price =
        transactionType === TransactionType.Buy
          ? factor / (Number(result.tokenOutAmount) * 10 ** difference)
          : (10 ** difference * Number(result.tokenOutAmount)) / factor;
      return { price };
    },
    {
      enabled: !!enabled && !!pools && !!initialDenom && !!resultingDenom,
      meta: {
        errorMessage: 'Error fetching price',
      },
    },
  );

  const formattedPrice =
    data && data.price
      ? data.price.toLocaleString('en-US', {
          maximumFractionDigits: 6,
          minimumFractionDigits: 6,
        })
      : undefined;

  return {
    price: data?.price,
    formattedPrice,
    pairAddress: '',
    isLoading: isPriceLoading || isLoadingPools,
    ...helpers,
  };
}
