import { useStation } from '@hooks/useStation';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useKeplr } from './useKeplr';

export enum WalletTypes {
  KEPLR = 'Keplr',
  STATION = 'Station',
}

export function useWallet() {
  const keplrWallet = useKeplr((state) => ({
    account: state.account,
    controller: state.controller,
    isConnecting: state.isConnecting,
    disconnect: state.disconnect,
  }));

  const stationWallet = useStation((state) => ({
    account: state.account,
    disconnect: state.disconnect,
    signAndBroadcast: state.signAndBroadcast,
    isConnecting: state.isConnecting,
  }));

  if (keplrWallet.account) {
    return {
      address: keplrWallet.account?.address,
      connected: true,
      signingClient: keplrWallet.controller,
      disconnect: keplrWallet.disconnect,
      walletType: WalletTypes.KEPLR,
      isConnecting: false,
    };
  }
  if (stationWallet?.account) {
    return {
      address: stationWallet.account?.address,
      connected: true,
      disconnect: stationWallet.disconnect,
      signingClient: {
        signAndBroadcast: (senderAddress: string, msgs: any, fee: any, memo?: string) =>
          stationWallet.signAndBroadcast(msgs),
      } as SigningCosmWasmClient,
      walletType: WalletTypes.STATION,
      isConnecting: false,
    };
  }
  return {
    isConnecting: keplrWallet.isConnecting || stationWallet?.isConnecting,
  };
}
