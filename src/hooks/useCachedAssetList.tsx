import { AssetList } from '@chain-registry/types';
import { ReactNode, useEffect } from 'react';
import { create } from 'zustand';
import { useAssetList } from './useAssetList';
import { useChainId } from './useChain';

type AssetListState = {
  assetList: AssetList | null;
  setAssetList: (assetList: AssetList) => void;
};

export const useAssetListStore = create<AssetListState>()((set) => ({
  assetList: null,
  setAssetList: (assetList: AssetList) => set({ assetList }),
}));

export function useCachedAssetList() {
  const { chainId: chain } = useChainId();
  const setAssetList = useAssetListStore((state) => state.setAssetList);
  const { data } = useAssetList();

  useEffect(() => {
    if (data) {
      setAssetList(data);
    }
  }, [data, chain, setAssetList]);

  return data || ({} as AssetListState);
}

export function AssetListWrapper({ children }: { children: ReactNode }) {
  useCachedAssetList();

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
