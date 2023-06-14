import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ethers } from 'ethers';

interface MetamaskWindow extends Window {
  ethereum?: ethers.Eip1193Provider;
}

declare const window: MetamaskWindow;

type IWallet = {
  connect: () => void;
  disconnect: () => void;
  isInstalled: boolean;
  account: { address: string } | null;
  autoconnect: boolean;
  init: () => void;
  isConnecting: boolean;
  provider: any | null;
  signer: any | null;
};

export const useMetamask = create<IWallet>()(
  persist(
    (set, get) => ({
      isInstalled: false,
      account: null,
      provider: null,
      signer: null,
      isConnecting: false,
      autoconnect: false,
      disconnect: async () => {
        await get().provider?.disconnect();
        set({ account: null });
        set({ autoconnect: false });
      },
      connect: async () => {
        set({ isConnecting: true });
        if (get().account) {
          get().disconnect();
        }

        try {
          const provider = new ethers.BrowserProvider(window.ethereum!);
          const accounts = await provider.send('eth_requestAccounts', []);

          const signer = await provider.getSigner();
          set({ account: { address: accounts[0] }, provider, autoconnect: true, signer });
        } catch (e) {
          console.error(e);
          set({ autoconnect: false });
        } finally {
          set({ isConnecting: false });
        }
      },
      init: () => {
        if (!get().isInstalled) {
          if (window.ethereum) set({ isInstalled: true });
        }
        if (get().autoconnect) {
          get().connect();
        }
      },
    }),

    {
      name: 'metamaskAutoconnect',
      partialize: (state) => ({ autoconnect: state.autoconnect }),
    },
  ),
);
