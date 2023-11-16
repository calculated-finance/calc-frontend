import 'isomorphic-fetch';
import { Asset, AssetList } from '@chain-registry/types';
import * as Sentry from '@sentry/react';
import testnetAssetList from 'src/assetLists/osmo-test-5.assetlist.json';
import mainnetAssetList from 'src/assetLists/osmosis-1.assetlist.json';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from './useChain';

export function findAsset(assets: Asset[], denom: string | undefined) {
  return assets.find((asset) => asset.base === denom);
}

export function useAssetList() {
  const { chainId } = useChainId();
  const baseUrl = 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main';

  return useQuery<AssetList>(
    ['assetList', chainId],
    async () => {
      try {
        const assetList = await fetch(`${baseUrl}/${chainId}/${chainId}.assetlist.json`);
        return await assetList.json();
      } catch (error) {
        Sentry.captureException(error, { tags: { page: 'useAssetList' } });
        return {
          'osmosis-1': mainnetAssetList,
          'osmo-test-5': testnetAssetList,
        }[chainId as string]!;
      }
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: !!chainId && ['osmosis-1', 'osmo-test-5'].includes(chainId),
      meta: {
        errorMessage: 'Error fetching asset list',
      },
    },
  );
}
