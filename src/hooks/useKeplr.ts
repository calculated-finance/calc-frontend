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
      if (window?.keplr) {
        resolve(true);
      } else {
        setTimeout(checkKeplr, timeout);
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
  address: string | null;
  isConnecting: boolean;
  controller: SigningCosmWasmClient | null;
};

const config = {
  endpoint: RPC_ENDPOINT,
  chainId: CHAIN_ID,
  options: {
    gasPrice: GasPrice.fromString('0.015ukuji'),
  },
};

export const useKeplr = create<IWallet>()(
  persist(
    (set, get) => ({
      isInstalled: false,
      stationController: null,
      account: null,
      address: null,
      controller: null,
      isConnecting: false,
      autoconnect: false,
      disconnect: async () => {
        await get().controller?.disconnect();
        set({ address: null });
        set({ autoconnect: false });
      },
      connect: async () => {
        set({ isConnecting: true });
        const chainInfo = CHAIN_INFO[CHAIN_ID];
        try {
          await window.keplr!.experimentalSuggestChain({
            ...chainInfo,
            feeCurrencies: chainInfo.feeCurrencies.filter((x) => x.coinMinimalDenom === 'ukuji'),
          });
          await window.keplr!.enable(CHAIN_ID);

          const offlineSigner = await window.keplr!.getOfflineSignerAuto(CHAIN_ID);

          const accounts = await offlineSigner.getAccounts();

          const client = await SigningCosmWasmClient.connectWithSigner(RPC_ENDPOINT, offlineSigner, config.options);
          set({ controller: client });
          set({ address: accounts[0].address });
          set({ autoconnect: true });
          set({ isConnecting: false });
        } catch (e) {
          console.error(e);
          set({ isConnecting: false });
          set({ autoconnect: false });
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
