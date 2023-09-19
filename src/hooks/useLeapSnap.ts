import { Keplr as WindowKeplr } from '@keplr-wallet/types';
import { AccountData } from '@cosmjs/proto-signing';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainEndpoint, getChainId, getGasPrice } from '@helpers/chains';
import { getSnap, CosmjsOfflineSigner, connectSnap } from '@leapwallet/cosmos-snap-provider';
import { Chains } from './useChain/Chains';

interface KeplrWindow extends Window {
  keplr?: WindowKeplr;
  leap?: WindowKeplr;
}

declare const window: KeplrWindow;

async function hasLeapSnaps() {
  const snapInstalled = await getSnap();
  return snapInstalled && snapInstalled.id === 'npm:@leapwallet/metamask-cosmos-snap';
}

type IWallet = {
  connect: (chain: Chains) => void;
  disconnect: () => void;
  isInstalled: boolean;
  account: AccountData | null;
  autoconnect: boolean;
  init: (chain: Chains) => void;
  isConnecting: boolean;
  controller: SigningCosmWasmClient | null;
};

export const useLeapSnap = create<IWallet>()(
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
      connect: async (chain: Chains) => {
        set({ isConnecting: true });

        if (get().account) {
          get().disconnect();
        }

        connectSnap();

        const chainId = getChainId(chain);

        try {
          const offlineSigner = new CosmjsOfflineSigner(chainId);
          const accounts = await offlineSigner.getAccounts();
          const client = await SigningCosmWasmClient.connectWithSigner(getChainEndpoint(chain), offlineSigner, {
            gasPrice: getGasPrice(chain),
          });

          set({
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
      init: async (chain: Chains) => {
        if (!get().isInstalled) {
          set({ isInstalled: await hasLeapSnaps() });
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
