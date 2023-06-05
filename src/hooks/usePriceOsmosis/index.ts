import { reverse } from 'rambda';
import { TransactionType } from '@components/TransactionType';
import { findPair } from '@helpers/findPair';
import { Denom } from '@models/Denom';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useOsmosis } from '@hooks/useOsmosis';
import Long from 'long';
import { Pair as OsmosisPair } from 'src/interfaces/generated-osmosis/response/get_pairs';
import { useOsmosisPools } from '@hooks/useOsmosisPools';
import { Pool } from 'osmojs/types/codegen/osmosis/gamm/pool-models/balancer/balancerPool';
import getDenomInfo from '@utils/getDenomInfo';
import { useQuery } from '@tanstack/react-query';
import usePairs from '../usePairs';

interface Step {
  poolId: Long;
  tokenOutDenom: string;
}

function findRoute(poolIds: number[], initialDenom: string, poolList: Pool[]): Step[] {
  let tokenInDenom = initialDenom;

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
  resultingDenom: Denom | undefined,
  initialDenom: Denom | undefined,
  transactionType: TransactionType,
  enabled: boolean,
) {
  const client = useCosmWasmClient((state) => state.client);
  const query = useOsmosis((state) => state.query);

  const { data: pools, isLoading: isLoadingPools } = useOsmosisPools(enabled);

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};

  const pair = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

  const route = pair && 'route' in pair ? (pair as OsmosisPair).route : undefined;

  const isRouteReversed = initialDenom !== pair?.quote_denom;

  const { significantFigures: initialSF } = getDenomInfo(initialDenom!);
  const { significantFigures: resultingSF } = getDenomInfo(resultingDenom!);

  const difference = initialSF - resultingSF;
  const factor = 10 ** initialSF;

  const {
    data,
    isLoading: isPriceLoading,
    ...helpers
  } = useQuery<{ tokenOutAmount: string }>(
    ['price-osmosis', pair, client],
    async () => {
      const directionalRoute = isRouteReversed ? reverse(route!) : route!;
      const result = query.osmosis.poolmanager.v1beta1.estimateSwapExactAmountIn({
        poolId: new Long(0),
        tokenIn: `${factor}${initialDenom}`,
        routes: findRoute(directionalRoute, initialDenom!, pools!),
      });
      return result;
    },
    {
      enabled: !!client && !!route && !!enabled && !!pools,
      meta: {
        errorMessage: 'Error fetching price',
      },
    },
  );

  const price =
    data &&
    (transactionType === TransactionType.Buy
      ? factor / (Number(data.tokenOutAmount) * 10 ** difference)
      : (10 ** difference * Number(data.tokenOutAmount)) / factor);

  const formattedPrice = price
    ? price.toLocaleString('en-US', {
        maximumFractionDigits: 6,
        minimumFractionDigits: 6,
      })
    : undefined;

  return {
    price,
    formattedPrice,
    pairAddress: pair?.address,
    isLoading: isPriceLoading || isLoadingPools,
    ...helpers,
  };
}
