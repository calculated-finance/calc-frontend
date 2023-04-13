import 'isomorphic-fetch';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { Asset, AssetList } from '@chain-registry/types';

export function findAsset(assets: Asset[], denom: string | undefined) {
  return assets.find((asset) => asset.base === denom);
}

export function useAssetList(): { isLoading: any; error: any; data: any } {
  return useQueryWithNotification<AssetList>(['assetList'], () =>
    fetch('https://raw.githubusercontent.com/osmosis-labs/assetlists/main/osmo-test-4/osmo-test-4.assetlist.json').then(
      (res) => res.json(),
    ),
  );
}
