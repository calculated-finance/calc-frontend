import { Keplr as WindowKeplr } from '@keplr-wallet/types';
import { AccountData } from '@cosmjs/proto-signing';
import { GasPrice } from '@cosmjs/stargate';
import { CHAIN_ID, RPC_ENDPOINT } from 'src/constants';
import { create } from 'zustand';
import { CHAIN_INFO } from 'kujira.js';
import { persist } from 'zustand/middleware';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

interface KeplrWindow extends Window {
  keplr?: WindowKeplr;
}

declare const window: KeplrWindow;

function waitForKeplr(timeout = 1000) {
  return new Promise((resolve) => {
    const checkKeplr = () => {
      try {
        if (window?.keplr) {
          resolve(true);
        } else {
          setTimeout(checkKeplr, timeout);
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkKeplr();
  });
}
type IWallet = {
  connect: null | (() => void);
  disconnect: () => void;
  isInstalled: boolean;
  account: AccountData | null;
  autoconnect: boolean;
  init: () => void;
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
      connect: async () => {
        set({ isConnecting: true });
        const chainInfo = CHAIN_INFO[CHAIN_ID];
        try {
          const keplr = window.keplr!;

          await keplr.experimentalSuggestChain({
            ...chainInfo,
            feeCurrencies: chainInfo.feeCurrencies.filter((x) => x.coinMinimalDenom === 'ukuji'),
          });

          await keplr.enable(CHAIN_ID);
          const offlineSigner = await keplr.getOfflineSignerAuto(CHAIN_ID);
          const accounts = await offlineSigner.getAccounts();
          const client = await SigningCosmWasmClient.connectWithSigner(RPC_ENDPOINT, offlineSigner, {
            gasPrice: GasPrice.fromString('0.015ukuji'),
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
      init: async () => {
        if (!get().controller) {
          await waitForKeplr();
          set({ isInstalled: true });
          if (get().autoconnect) {
            get().connect?.();
          }
        }
      },
    }),

    {
      name: 'keplrAutoconnect',
      partialize: (state) => ({ autoconnect: state.autoconnect }),
    },
  ),
);
