import Long from 'long';
import { osmosis } from 'osmojs';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { useOsmosis } from './useOsmosis';

const POOLS_QUERY_LIMIT = 800;

async function fetchPoolsRecursively(queryClient: any, allPools = [] as any[], injectedKey = []): Promise<any[]> {
  const key = injectedKey.length ? injectedKey : new Uint8Array([]);
  const poolsResponse = await queryClient?.osmosis.gamm.v1beta1.pools({
    pagination: {
      limit: Long.fromNumber(POOLS_QUERY_LIMIT, true),
      key,
      offset: Long.fromNumber(0, true),
    },
  });
  const { nextKey } = poolsResponse?.pagination || {};

  const decodedPools = await poolsResponse?.pools.map((pool: any) => {
    try {
      const decodedPool = osmosis.gamm.v1beta1.Pool.decode(pool.value);
      return decodedPool;
    } catch (e) {
      return null;
    }
  });
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
    () => fetchPoolsRecursively(query),

    { enabled: !!query && enabled },
  );
}
