import { Keplr as WindowKeplr } from '@keplr-wallet/types';
import { AccountData } from '@cosmjs/proto-signing';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainEndpoint, getChainId, getGasPrice } from '@helpers/chains';
import { CosmjsOfflineSigner, connectSnap, getSnaps, Snap } from '@leapwallet/cosmos-snap-provider';
import { find, values } from 'rambda';

import { ChainId } from './useChainId/Chains';

interface KeplrWindow extends Window {
  keplr?: WindowKeplr;
  leap?: WindowKeplr;
}

declare const window: KeplrWindow;
const leapSnapId = 'npm:@leapwallet/metamask-cosmos-snap';

async function hasLeapSnap() {
  try {
    const installedSnaps = await getSnaps();
    return !!find((snap: Snap) => snap.id === leapSnapId, values(installedSnaps));
  } catch (error) {
    return false;
  }
}

type IWallet = {
  connect: (chain: ChainId) => void;
  disconnect: () => void;
  isInstalled: boolean;
  account: AccountData | null;
  autoconnect: boolean;
  init: (chain: ChainId) => void;
  isConnecting: boolean;
  controller: SigningCosmWasmClient | null;
};

export const useMetamaskSnap = create<IWallet>()(
  persist(
    (set, get) => ({
      isInstalled: false,
      account: null,
      controller: null,
      isConnecting: false,
      autoconnect: false,
      disconnect: async () => {
        get().controller?.disconnect();
        set({ account: null });
        set({ autoconnect: false });
      },
      connect: async (chain: ChainId) => {
        set({ isConnecting: true });

        if (get().account) {
          get().disconnect();
        }

        const chainId = getChainId(chain);

        try {
          if (!get().isInstalled) {
            await connectSnap(leapSnapId);
          }

          set({
            isInstalled: true,
            autoconnect: true,
          });

          const offlineSigner = new CosmjsOfflineSigner(chainId);
          const accounts = await offlineSigner.getAccounts();
          const client = await SigningCosmWasmClient.connectWithSigner(getChainEndpoint(chain), offlineSigner, {
            gasPrice: getGasPrice(chain),
          });

          set({
            isInstalled: true,
            controller: client,
            account: accounts[0],
            autoconnect: true,
          });
        } catch (e) {
          set({ autoconnect: false });
        } finally {
          set({ isConnecting: false });
        }
      },
      init: async (chain: ChainId) => {
        if (!get().isInstalled) {
          set({ isInstalled: await hasLeapSnap() });
        }
        if (get().autoconnect) {
          get().connect(chain);
        }
      },
    }),

    {
      name: 'leapAutoconnect',
      partialize: (state) => ({ autoconnect: state.autoconnect }),
    },
  ),
);
