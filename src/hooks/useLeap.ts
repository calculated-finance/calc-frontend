import { Keplr as WindowKeplr } from '@keplr-wallet/types';
import { AccountData } from '@cosmjs/proto-signing';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainEndpoint, getChainId, getChainInfo, getFeeCurrencies, getGasPrice } from '@helpers/chains';
import { Chains } from './useChain/Chains';

interface KeplrWindow extends Window {
  keplr?: WindowKeplr;
  leap?: WindowKeplr;
}

declare const window: KeplrWindow;

function waitForLeap(timeout = 1000) {
  return new Promise((resolve) => {
    const check = () => {
      try {
        if (typeof window !== 'undefined') {
          if (window && window.leap) {
            resolve(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
      setTimeout(check, timeout);
    };

    check();
  });
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

export const useLeap = create<IWallet>()(
  persist(
    (set, get) => ({
      isInstalled: false,
      account: null,
      controller: null,
      isConnecting: false,
      autoconnect: false,
      disconnect: async () => {
        await get().controller?.disconnect();
        set({ account: null });
        set({ autoconnect: false });
      },
      connect: async (chain: Chains) => {
        set({ isConnecting: true });
        if (get().account) {
          get().disconnect();
        }
        const chainId = getChainId(chain);
        const chainInfo = getChainInfo(chain);
        try {
          const keplr = window.leap!;

          await keplr.experimentalSuggestChain({
            ...chainInfo,
            feeCurrencies: getFeeCurrencies(chain),
          });

          await keplr.enable(chainId);
          const offlineSigner = await keplr.getOfflineSignerAuto(chainId);
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
          console.error(e);
          set({ autoconnect: false });
        } finally {
          set({ isConnecting: false });
        }
      },
      init: async (chain: Chains) => {
        if (!get().isInstalled) {
          await waitForLeap();
          set({ isInstalled: true });
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
