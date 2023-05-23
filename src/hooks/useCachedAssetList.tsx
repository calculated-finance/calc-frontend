import { AssetList } from '@chain-registry/types';
import { isMainnet } from '@utils/isMainnet';
import { ReactNode, useEffect, useState } from 'react';
import { create } from 'zustand';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { useAssetList } from './useAssetList';

type AssetListState = {
  assetList: AssetList | null;
  setAssetList: (assetList: AssetList) => void;
};

export const useAssetListStore = create<AssetListState>()((set) => ({
  assetList: null,
  setAssetList: (assetList: AssetList) => set({ assetList }),
}));

export function useCachedAssetList() {
  const setAssetList = useAssetListStore((state) => state.setAssetList);
  const { data } = useAssetList();

  useEffect(() => {
    if (data) {
      setAssetList(data);
    }
  }, [data, setAssetList]);

  return data || ({} as AssetListState);
}

export function AssetListWrapper({ children }: { children: ReactNode }) {
  useCachedAssetList();

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
