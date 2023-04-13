import Long from 'long';
import { osmosis } from 'osmojs';
import { Pool } from 'osmojs/types/codegen/osmosis/gamm/pool-models/balancer/balancerPool';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { isNil } from 'lodash';
import { Denom } from '@models/Denom';
import { useOsmosis } from './useOsmosis';
import { findAsset, useAssetList } from './useAssetList';

export function useOsmosisPools(denom: Denom | undefined) {
  const query = useOsmosis((state) => state.query);
  const { data: assetData } = useAssetList();

  return useQueryWithNotification(
    ['pools-for-denom', denom],
    async () => {
      const pools = await query?.osmosis.gamm.v1beta1.pools({
        pagination: { limit: Long.fromNumber(1000, true), key: Long.fromNumber(0), offset: Long.fromNumber(0) },
      });

      const decodedPools = pools?.pools
        .map((pool: any) => {
          try {
            const decodedPool = osmosis.gamm.v1beta1.Pool.decode(pool.value);
            if (decodedPool.poolAssets.length !== 2) {
              return null;
            }
            if (
              !findAsset(assetData.assets, decodedPool.poolAssets[0].token?.denom) ||
              !findAsset(assetData.assets, decodedPool.poolAssets[1].token?.denom)
            ) {
              return null;
            }
            if (decodedPool.poolAssets.find((poolAsset) => poolAsset.token?.denom === denom)) {
              return decodedPool;
            }
            return null;
          } catch (e) {
            return null;
          }
        })
        .filter((pool: Pool) => !isNil(pool)) as Pool[];

      return decodedPools;
    },
    { enabled: !!assetData && !!query && !!denom },
  );
}
