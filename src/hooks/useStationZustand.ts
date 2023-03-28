import { AccountData, EncodeObject } from '@cosmjs/proto-signing';
import { assertIsDeliverTxSuccess, DeliverTxResponse } from '@cosmjs/stargate';
import { ChainInfo } from '@keplr-wallet/types';
import { ConnectType, getChainOptions, WalletController } from '@terra-money/wallet-controller';
import { CHAIN_INFO } from 'kujira.js';
import { useCookieState } from 'ahooks';
import { CHAIN_ID } from 'src/constants';
import { Station as StationWallet } from 'src/wallets';
import { useEffect } from 'react';
import { create } from 'zustand';
import { shallow } from 'zustand/middleware';

export enum Adapter {
  Station = 'station',
}

export type IWallet = {
  connect: null | (() => void);
  disconnect: () => void;
  signAndBroadcast: (msgs: EncodeObject[]) => Promise<DeliverTxResponse>;
  isStationInstalled: boolean;
  stationController: WalletController | null;
  wallet: StationWallet | null;
  stored: Adapter | null;
  init: () => void;
};

export const useStationStore = create<IWallet>((set, get) => ({
  disconnect: () => {
    set((state: IWallet) => ({
      ...state,
      account: null,
      wallet: null,
    }));
    get().wallet?.disconnect();
  },
  signAndBroadcast: async (msgs: EncodeObject[]) => {
    const { wallet } = get();
    if (!wallet) throw new Error('No Wallet Connected');
    const res = await wallet.signAndBroadcast(msgs);
    assertIsDeliverTxSuccess(res);
    return res;
  },
  isStationInstalled: false,
  wallet: null,
  stationController: null,
  stored: null,
  connect: () => {
    const { stationController } = get();

    if (stationController) {
      StationWallet.connect(CHAIN_INFO[CHAIN_ID], {
        controller: stationController,
      })
        .then((x) => {
          set({ stored: Adapter.Station });
          set({ wallet: x });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  init: () => {
    if (!get().stationController) {
      getChainOptions().then((opts) => {
        const stationController = new WalletController(opts);
        set({ stationController });

        stationController?.availableConnections().subscribe((next) => {
          if (next.find((x) => x.type === ConnectType.EXTENSION))
            useStationStore.setState({ isStationInstalled: true });

          if (!get().wallet && get().stored === Adapter.Station) {
            setTimeout(() => {
              get().connect?.();
            }, 10);
          }
        });
      });
    }
  },
}));

export function useStation() {
  const { wallet, connect, disconnect, signAndBroadcast } = useStationStore(
    (state) => ({
      wallet: state.wallet,
      connect: state.connect,
      disconnect: state.disconnect,
      signAndBroadcast: state.signAndBroadcast,
      stationController: state.stationController,
      stored: state.stored,
      init: state.init,
      isStationInstalled: state.isStationInstalled,
    }),
    shallow,
  );

  return {
    connect,
    disconnect,
    signAndBroadcast,
    isStationInstalled: true,
    account: wallet?.account || null,
  };
}
