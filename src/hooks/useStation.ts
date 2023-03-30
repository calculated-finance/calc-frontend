import { AccountData, EncodeObject } from '@cosmjs/proto-signing';
import { assertIsDeliverTxSuccess, DeliverTxResponse, StargateClient } from '@cosmjs/stargate';
import { ConnectedWallet, ConnectType, getChainOptions, WalletController } from '@terra-money/wallet-controller';
import { CHAIN_ID, RPC_ENDPOINT } from 'src/constants';
import { create } from 'zustand';
import { Msg } from '@terra-money/feather.js';
import { registry } from 'kujira.js';
import { fromBech32, toBech32 } from '@cosmjs/encoding';
import { persist } from 'zustand/middleware';

export enum Adapter {
  Station = 'station',
}

type IWallet = {
  connect: null | (() => void);
  disconnect: () => void;
  signAndBroadcast: (msgs: EncodeObject[]) => Promise<DeliverTxResponse>;
  isStationInstalled: boolean;
  stationController: WalletController | null;
  account: AccountData | null;
  stored: Adapter | null;
  init: () => void;
};

export const useStation = create<IWallet>()(
  persist(
    (set, get) => ({
      isStationInstalled: false,
      stationController: null,
      stored: null,
      account: null,
      disconnect: () => {
        get().stationController?.disconnect();
        set({ account: null });
      },
      signAndBroadcast: async (msgs: EncodeObject[]) => {
        const { account, stationController } = get();
        if (!account || !stationController) throw new Error('No Wallet Connected');

        const terraMsgs = msgs.map((m) => Msg.fromProto({ typeUrl: m.typeUrl, value: registry.encode(m) }));

        const res = await stationController.sign({
          msgs: terraMsgs,
          chainID: CHAIN_ID,
        });

        const stargate = await StargateClient.connect(RPC_ENDPOINT);
        const result = await stargate.broadcastTx(res.result.toBytes());

        assertIsDeliverTxSuccess(result);
        return result;
      },
      connect: async () => {
        const { stationController } = get();

        if (stationController) {
          await stationController.connect(ConnectType.EXTENSION);
          const wallet: ConnectedWallet = await new Promise((r) =>
            // eslint-disable-next-line no-promise-executor-return
            stationController.connectedWallet().subscribe((next) => {
              if (next) {
                r(next);
              }
            }),
          );

          const account: AccountData = {
            address: toBech32('kujira', fromBech32(wallet.addresses[CHAIN_ID]).data),
            algo: 'secp256k1',
            pubkey: new Uint8Array(),
          };

          set({ stored: Adapter.Station });
          set({ account });
        }
      },
      init: () => {
        if (!get().stationController) {
          getChainOptions().then((opts) => {
            const stationController = new WalletController(opts);

            stationController?.availableConnections().subscribe((next) => {
              if (next.find((x) => x.type === ConnectType.EXTENSION)) useStation.setState({ isStationInstalled: true });

              setTimeout(() => {
                if (!get().account && get().stored === Adapter.Station) {
                  get().connect?.();
                }
                set({ stationController });
              }, 10);
            });
          });
        }
      },
    }),
    {
      name: 'stored',
      partialize: (state) => ({ stored: state.stored }),
    },
  ),
);
