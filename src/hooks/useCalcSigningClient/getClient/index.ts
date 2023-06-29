import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { JsonRpcSigner } from 'ethers';
import { ChainConfig, ChainType } from '@helpers/chains';
import { Config } from 'src/interfaces/v2/generated/response/get_config';
import { getEVMSigningClient } from './clients/evm';
import { getCosmosSigningClient } from './clients/cosmos';

export default function getClient(
  chainConfig: ChainConfig,
  fetchedConfig: Config | undefined,
  evmSigner: JsonRpcSigner | null,
  cosmSigner: SigningCosmWasmClient | null | undefined,
) {
  if (chainConfig.chainType === ChainType.EVM) {
    if (!evmSigner) return null;

    return getEVMSigningClient(evmSigner);
  }

  if (chainConfig.chainType === ChainType.Cosmos) {
    if (!cosmSigner) return null;
    if (!fetchedConfig) return null;

    return getCosmosSigningClient(cosmSigner, chainConfig, fetchedConfig);
  }

  throw new Error('Unsupported chain');
}
