import 'isomorphic-fetch';
import { Asset, AssetList } from '@chain-registry/types';
import { useQuery } from '@tanstack/react-query';
import { reduce } from 'rambda';
import { useChainId } from './useChain';

export function findAsset(assets: Asset[], denom: string | undefined) {
  return assets.find((asset) => asset.base === denom);
}

export function useAssetList() {
  const { chainId } = useChainId();
  const baseUrl = 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main';

  return useQuery<Record<string, Asset>>(
    ['assetList', chainId],
    async () => {
      const responses = await Promise.all(
        ['osmosis-1', 'osmo-test-5'].map((chain) => fetch(`${baseUrl}/${chain}/${chain}.assetlist.json`)),
      );

      const assetLists = await Promise.all(responses.map((response) => response.json()));

      return reduce(
        (allAssets, asset: any) => ({ ...allAssets, [asset.base]: asset }),
        {},
        assetLists.map((l) => l.assets).flat(),
      );
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: !!chainId,
      meta: {
        errorMessage: 'Error fetching asset lists',
      },
    },
  );
}
