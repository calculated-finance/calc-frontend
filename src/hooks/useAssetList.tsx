import 'isomorphic-fetch';
import { Asset, AssetList } from '@chain-registry/types';
import * as Sentry from '@sentry/react';
import { isMainnet } from '@utils/isMainnet';
import testnetAssetList from 'src/assetLists/osmo-test-5.assetlist.json';
import mainnetAssetList from 'src/assetLists/osmosis-1.assetlist.json';
import { useQuery } from '@tanstack/react-query';
import { useChain } from './useChain';
import { ChainId } from './useChain/Chains';

export function findAsset(assets: Asset[], denom: string | undefined) {
  return assets.find((asset) => asset.base === denom);
}

export function useAssetList() {
  const { chain } = useChain();
  const baseUrl = 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main';

  const chainIdentifier = isMainnet() ? 'osmosis-1/osmosis-1' : 'osmo-test-5/osmo-test-5';

  const backup = isMainnet() ? mainnetAssetList : testnetAssetList;

  return useQuery<AssetList>(
    ['assetList'],
    async () => {
      try {
        const assetList = await fetch(`${baseUrl}/${chainIdentifier}.assetlist.json`);
        return await assetList.json();
      } catch (error) {
        Sentry.captureException(error, { tags: { page: 'useAssetList' } });
        return backup;
      }
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: chain === 'osmosis-1',
      meta: {
        errorMessage: 'Error fetching asset list',
      },
    },
  );
}
