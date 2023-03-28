// wrap wizard-ui's useWallet in our own hook to add some extra functionality

import { useWallet as useWizardUiWallet } from '@wizard-ui/react';
import { useStation, useStationStore } from '@hooks/useStationZustand';
import { useNetwork } from './useNetwork';

export enum WalletTypes {
  KEPLR = 'Keplr',
  STATION = 'Station',
}

export function useWallet() {
  const {
    address,
    connected: wizardConnected,
    client,
    signingClient,
    connecting,
    disconnect,
    wallets,
  } = useWizardUiWallet();

  const kujiWallet = useStationStore((state) => ({
    wallet: state.wallet,
    disconnect: state.disconnect,
    signAndBroadcast: state.signAndBroadcast,
  }));

  const { query } = useNetwork();

  if (wizardConnected) {
    return {
      address,
      connected: wizardConnected,
      client,
      signingClient,
      connecting,
      disconnect,
      wallets,
      walletType: WalletTypes.KEPLR,
    };
  }
  if (kujiWallet?.wallet?.account && query) {
    return {
      address: kujiWallet.wallet.account?.address,
      connected: true,
      disconnect: kujiWallet.disconnect,
      signingClient: {
        signAndBroadcast: (senderAddress: string, msgs: any, fee: any, memo: string) =>
          kujiWallet.signAndBroadcast(msgs),
      },
      client: {
        getBalance: query.bank.balance,

        queryContractSmart: query.wasm.queryContractSmart,
      },
      walletType: WalletTypes.STATION,
    };
  }
  return {};
}
