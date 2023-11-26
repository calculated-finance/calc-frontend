import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getGasPrice } from '@helpers/chains';
import { useCosmosKit } from './useCosmosKit';
import { useChainId } from './useChainId';
import { ChainId } from './useChainId/Chains';

export function useWallet() {
  const { chainId: currentChainId } = useChainId();
  const cosmosKit = useCosmosKit(currentChainId);

  const getSigningClient = async (chainId: ChainId) =>
    SigningCosmWasmClient.connectWithSigner(
      await cosmosKit.getRpcEndpoint(process.env.NEXT_PUBLIC_APP_ENV !== 'production'),
      cosmosKit.getOfflineSignerDirect(),
      {
        gasPrice: getGasPrice(chainId),
      },
    );

  if (currentChainId && cosmosKit && cosmosKit.isWalletConnected) {
    return {
      address: cosmosKit.address,
      connected: cosmosKit.isWalletConnected,
      getSigningClient,
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
