import 'isomorphic-fetch';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { Asset, AssetList } from '@chain-registry/types';
import { isMainnet } from '@utils/isMainnet';

export function findAsset(assets: Asset[], denom: string | undefined) {
  return assets.find((asset) => asset.base === denom);
}

export function useAssetList(): { isLoading: any; error: any; data: any } {

  const baseUrl = 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main'

  const chainIdentifier = isMainnet() ? 'osmosis-1/osmosis-1' : 'osmo-test-4/osmo-test-4'

  return useQueryWithNotification<AssetList>(['assetList'], () =>
    fetch(`${baseUrl}/${chainIdentifier}.assetlist.json`).then(
      (res) => res.json(),
    ),
  );
}
