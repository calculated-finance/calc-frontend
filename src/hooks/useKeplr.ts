import { Keplr as WindowKeplr } from '@keplr-wallet/types';
import * as Sentry from '@sentry/react';
import { AccountData } from '@cosmjs/proto-signing';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainId, getChainInfo, getFeeCurrencies, getGasPrice } from '@helpers/chains';
import { Chains } from './useChain/Chains';

interface KeplrWindow extends Window {
  keplr?: WindowKeplr & { isXDEFI?: boolean };
}

declare const window: KeplrWindow;

function waitForKeplr(timeout = 1000) {
  return new Promise((resolve) => {
    const checkKeplr = () => {
      try {
        if (typeof window !== 'undefined') {
          if (window && window.keplr) {
            if (window.keplr.isXDEFI) {
              resolve(false);
            }
            resolve(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
      setTimeout(checkKeplr, timeout);
    };

    checkKeplr();
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

export const useKeplr = create<IWallet>()(
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
          const keplr = window.keplr!;

          await keplr.experimentalSuggestChain({
            ...chainInfo,
            feeCurrencies: getFeeCurrencies(chain),
          });

          await keplr.enable(chainId);
          const offlineSigner = await keplr.getOfflineSignerAuto(chainId);
          const accounts = await offlineSigner.getAccounts();
          const client = await SigningCosmWasmClient.connectWithSigner(chainInfo.rpc, offlineSigner, {
            gasPrice: getGasPrice(chain),
          });

          set({
            controller: client,
            account: accounts[0],
            autoconnect: true,
          });
        } catch (e) {
          Sentry.captureException(e);
          set({ autoconnect: false });
        } finally {
          set({ isConnecting: false });
        }
      },
      init: async (chain: Chains) => {
        if (!get().isInstalled) {
          const foundKeplr = await waitForKeplr();
          if (foundKeplr) {
            set({ isInstalled: true });
          }
        }
        if (get().autoconnect) {
          get().connect(chain);
        }
      },
    }),

    {
      name: 'keplrAutoconnect',
      partialize: (state) => ({ autoconnect: state.autoconnect }),
    },
  ),
);
