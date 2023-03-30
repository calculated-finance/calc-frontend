// wrap wizard-ui's useWallet in our own hook to add some extra functionality

import { useWallet as useWizardUiWallet } from '@wizard-ui/react';
import { useStationStore } from '@hooks/useStationZustand';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
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
    account: state.account,
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
  if (kujiWallet?.account && query) {
    return {
      address: kujiWallet.account?.address,
      connected: true,
      disconnect: kujiWallet.disconnect,
      signingClient: {
        signAndBroadcast: (senderAddress: string, msgs: any, fee: any, memo?: string) =>
          kujiWallet.signAndBroadcast(msgs),
      } as SigningCosmWasmClient,
      client: {
        getBalance: query.bank.balance,

        queryContractSmart: query.wasm.queryContractSmart,
      },
      walletType: WalletTypes.STATION,
    };
  }
  return {};
}
