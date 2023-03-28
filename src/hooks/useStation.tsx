import { AccountData, EncodeObject } from '@cosmjs/proto-signing';
import { assertIsDeliverTxSuccess, DeliverTxResponse } from '@cosmjs/stargate';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { ChainInfo } from '@keplr-wallet/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ConnectType, getChainOptions, WalletController } from '@terra-money/wallet-controller';
import { CHAIN_INFO } from 'kujira.js';
import { createContext, useContext, useEffect, useState } from 'react';
import { Station as StationWallet } from 'src/wallets';
import { useCookieState } from 'ahooks';
import { CHAIN_ID } from 'src/constants';

export enum Adapter {
  Station = 'station',
}

export type IWallet = {
  connect: null | (() => void);
  disconnect: () => void;
  account: AccountData | null;
  signAndBroadcast: (msgs: EncodeObject[], memo?: string) => Promise<DeliverTxResponse>;
  adapter: null | Adapter;
  isStationInstalled: boolean;
};

const Context = createContext<IWallet>({
  account: null,
  connect: null,
  disconnect: () => {},
  signAndBroadcast: async () => {
    throw new Error('Not Implemented');
  },
  adapter: null,
  isStationInstalled: false,
});

export function WalletContext({ children }: ChildrenProp) {
  const [stored, setStored] = useCookieState('wallet', { defaultValue: '' });
  const [wallet, setWallet] = useState<StationWallet | null>(null);
  const [stationController, setStationController] = useState<WalletController | null>(null);

  const [isStationInstalled, setIsStationInstalled] = useState(false);

  useEffect(() => {
    getChainOptions().then((opts) => setStationController(new WalletController(opts)));
  }, []);

  useEffect(() => {
    stationController?.availableConnections().subscribe((next) => {
      if (next.find((x) => x.type === ConnectType.EXTENSION)) setIsStationInstalled(true);
    });
  }, [stationController]);

  const signAndBroadcast = async (msgs: EncodeObject[]): Promise<DeliverTxResponse> => {
    if (!wallet) throw new Error('No Wallet Connected');
    const res = await wallet.signAndBroadcast(msgs);
    assertIsDeliverTxSuccess(res);
    return res;
  };

  const connect = () => {
    const chainInfo: ChainInfo = {
      ...CHAIN_INFO[CHAIN_ID],
    };

    if (stationController) {
      StationWallet.connect(chainInfo, {
        controller: stationController,
      })
        .then((x) => {
          setStored(Adapter.Station);
          setWallet(x);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (!wallet && stored === Adapter.Station) {
      stationController?.availableConnections().subscribe((next) => {
        if (next.find((x) => x.type === ConnectType.EXTENSION))
          setTimeout(() => {
            connect();
          }, 10);
      });
    }
  }, [stationController]);

  useEffect(() => {
    wallet?.onChange(setWallet);
  }, [wallet]);

  const disconnect = () => {
    setStored('');
    setWallet(null);
    wallet?.disconnect();
  };

  const adapter = wallet instanceof StationWallet ? Adapter.Station : null;

  return (
    <Context.Provider
      key={wallet?.account.address}
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        adapter,
        account: wallet?.account || null,
        connect,
        disconnect,
        signAndBroadcast,
        isStationInstalled,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useStation() {
  console.log('hi');
  return useContext(Context);
}
