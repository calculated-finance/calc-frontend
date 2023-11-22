import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainEndpoint, getGasPrice } from '@helpers/chains';
import { useCosmosKit } from './useCosmosKit';
import { useChainId } from './useChainId';

export function useWallet() {
  const { chainId } = useChainId();
  const cosmosKit = useCosmosKit(chainId);

  if (chainId && cosmosKit && cosmosKit.isWalletConnected) {
    return {
      address: cosmosKit.address,
      connected: cosmosKit.isWalletConnected,
      getSigningClient: async () =>
        SigningCosmWasmClient.connectWithSigner(getChainEndpoint(chainId), cosmosKit.getOfflineSignerDirect(), {
          gasPrice: getGasPrice(chainId),
        }),
      disconnect: cosmosKit.disconnect,
      walletType: cosmosKit.wallet?.prettyName,
      isConnecting: cosmosKit.isWalletConnecting,
    };
  }

  return {
    address: undefined,
    connected: false,
    getSigningClient: null,
    disconnect: undefined,
    walletType: undefined,
    isConnecting: false,
  };
}
