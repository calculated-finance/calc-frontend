import { Pool } from 'osmojs/types/codegen/osmosis/gamm/pool-models/balancer/balancerPool';
import { findAsset, useAssetList } from '../hooks/useAssetList';

export function PoolDescription({ pool }: { pool: Pool }) {
  const { data: assetData } = useAssetList();

  const assetIn = findAsset(assetData.assets, pool.poolAssets[0].token?.denom);
  const assetOut = findAsset(assetData.assets, pool.poolAssets[1].token?.denom);
  return (
    <>
      {assetIn?.symbol} / {assetOut?.symbol} Single sided LP ({pool.futurePoolGovernor})
    </>
  );
}
