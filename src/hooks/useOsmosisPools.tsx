import Long from 'long';
import { osmosis } from 'osmojs';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { Pool } from 'osmojs/types/codegen/osmosis/gamm/pool-models/balancer/balancerPool';
import { QueryPoolsResponse } from 'osmojs/types/codegen/osmosis/concentrated-liquidity/pool-model/query';
import { useOsmosis } from './useOsmosis';

const POOLS_QUERY_LIMIT = 800;

async function fetchPoolsRecursively(
  queryClient: any,
  allPools: Pool[],
  injectedKey: Uint8Array | undefined,
): Promise<Pool[]> {
  const key = injectedKey?.length ? injectedKey : new Uint8Array([]);
  const poolsResponse = (await queryClient?.osmosis.gamm.v1beta1.pools({
    pagination: {
      limit: Long.fromNumber(POOLS_QUERY_LIMIT, true),
      key,
      offset: Long.fromNumber(0, true),
    },
  })) as QueryPoolsResponse;
  const { nextKey } = poolsResponse?.pagination || {};

  const decodedPools = (await poolsResponse?.pools
    .map((pool) => {
      try {
        const decodedPool = osmosis.gamm.v1beta1.Pool.decode(pool.value);
        return decodedPool;
      } catch (e) {
        return undefined;
      }
    })
    .filter((pool) => pool !== undefined)) as Pool[];
  allPools.push(...decodedPools);

  if (decodedPools.length === POOLS_QUERY_LIMIT) {
    return fetchPoolsRecursively(queryClient, allPools, nextKey);
  }

  return allPools;
}

export function useOsmosisPools(enabled = true) {
  const query = useOsmosis((state) => state.query);

  return useQueryWithNotification(
    ['pools-for-denom'],
    () => fetchPoolsRecursively(query, [], undefined),

    { enabled: !!query && enabled },
  );
}
