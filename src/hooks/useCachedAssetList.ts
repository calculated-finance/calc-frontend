import { AssetList } from "@chain-registry/types";
import { isMainnet } from "@utils/isMainnet";
import { useEffect, useState } from "react";
import { create } from "zustand";

type AssetListState = {
    assetList: AssetList | null;
    setAssetList: (assetList: AssetList) => void;
};

export const useAssetListStore = create<AssetListState>()(
    (set) => ({
        assetList: null,
        setAssetList: (assetList: AssetList) => set({ assetList }),
    }),
);

export function useCachedAssetList() {
    const setAssetList = useAssetListStore((state) => state.setAssetList);

    const [data, setData] = useState<AssetListState>();

    const baseUrl = 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main';
    const chainIdentifier = isMainnet() ? 'osmosis-1/osmosis-1' : 'osmo-test-5/osmo-test-5';

    useEffect(() => {
        fetch(`${baseUrl}/${chainIdentifier}.assetlist.json`)
            .then((response) => response.json())
            .then((assetList: AssetList) => {
                setAssetList(assetList);
                setData({ assetList, setAssetList });
            });
    }, [setAssetList]);

    return data || ({} as AssetListState);
}