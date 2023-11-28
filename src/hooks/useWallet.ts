import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getGasPrice } from '@helpers/chains';
import { useCosmosKit } from './useCosmosKit';
import { ChainId } from './useChainId/Chains';

export function useWallet() {
  const cosmosKit = useCosmosKit();

  const getSigningClient = async (chainId: ChainId) =>
    SigningCosmWasmClient.connectWithSigner(
      await cosmosKit.getRpcEndpoint(process.env.NEXT_PUBLIC_APP_ENV !== 'production'),
      cosmosKit.getOfflineSignerAmino(),
      {
        gasPrice: getGasPrice(chainId),
      },
    );

  if (cosmosKit && cosmosKit.isWalletConnected) {
    return {
      connected: cosmosKit.isWalletConnected,
      getSigningClient,
      walletType: cosmosKit.wallet?.prettyName,
      isConnecting: cosmosKit.isWalletConnecting,
      ...cosmosKit,
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
