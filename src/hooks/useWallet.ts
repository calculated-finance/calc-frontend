import { useStation } from '@hooks/useStation';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useKujira } from './useKujira';
import { useKeplr } from './useKeplr';

export enum WalletTypes {
  KEPLR = 'Keplr',
  STATION = 'Station',
}

export function useWallet() {
  const keplrWallet = useKeplr((state) => ({
    address: state.address,
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

  const query = useKujira((state) => state.query);

  if (keplrWallet.address && query) {
    return {
      address: keplrWallet.address,
      connected: true,
      client: {
        getBalance: query.bank.balance,

        queryContractSmart: query.wasm.queryContractSmart,
      },
      signingClient: keplrWallet.controller,
      disconnect: keplrWallet.disconnect,
      walletType: WalletTypes.KEPLR,
      isConnecting: false,
    };
  }
  if (stationWallet?.account && query) {
    return {
      address: stationWallet.account?.address,
      connected: true,
      disconnect: stationWallet.disconnect,
      signingClient: {
        signAndBroadcast: (senderAddress: string, msgs: any, fee: any, memo?: string) =>
          stationWallet.signAndBroadcast(msgs),
      } as SigningCosmWasmClient,
      client: {
        getBalance: query.bank.balance,

        queryContractSmart: query.wasm.queryContractSmart,
      },
      walletType: WalletTypes.STATION,
      isConnecting: false,
    };
  }
  return {
    isConnecting: keplrWallet.isConnecting || stationWallet?.isConnecting,
  };
}
