import 'isomorphic-fetch';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { Asset, AssetList } from '@chain-registry/types';
import { isMainnet } from '@utils/isMainnet';
import { Chains, useChain } from './useChain';

export function findAsset(assets: Asset[], denom: string | undefined) {
  return assets.find((asset) => asset.base === denom);
}

export function useAssetList(): { isLoading: any; error: any; data: any } {
  const { chain } = useChain();
  const baseUrl = 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main';

  const chainIdentifier = isMainnet() ? 'osmosis-1/osmosis-1' : 'osmo-test-5/osmo-test-5';

  return useQueryWithNotification<AssetList>(
    ['assetList'],
    () => fetch(`${baseUrl}/${chainIdentifier}.assetlist.json`).then((res) => res.json()),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: chain === Chains.Osmosis,
    },
  );
}
