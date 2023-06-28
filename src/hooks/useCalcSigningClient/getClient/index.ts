import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { JsonRpcSigner } from 'ethers';
import { ChainConfig, ChainType } from '@helpers/chains';
import { getEVMSigningClient } from './clients/evm';
import { getCosmosSigningClient } from './clients/cosmos';

export default function getClient(
  chainConfig: ChainConfig,
  evmSigner: JsonRpcSigner | null,
  cosmSigner: SigningCosmWasmClient | null | undefined,
) {
  if (chainConfig.chainType === ChainType.EVM) {
    if (!evmSigner) return null;

    return getEVMSigningClient(evmSigner);
  }

  if (chainConfig.chainType === ChainType.Cosmos) {
    if (!cosmSigner) return null;

    return getCosmosSigningClient(cosmSigner, chainConfig);
  }
}
