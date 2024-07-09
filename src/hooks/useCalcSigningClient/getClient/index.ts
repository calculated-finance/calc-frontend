import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainConfig } from '@helpers/chains';
import { Config } from 'src/interfaces/dca/response/get_config';
import { getCosmosCalcSigningClient } from './clients/cosmos';

export default function getClient(
  chainConfig: ChainConfig,
  fetchedConfig: Config | undefined,
  signingClient: SigningCosmWasmClient | null | undefined,
) {
  return signingClient && fetchedConfig && getCosmosCalcSigningClient(signingClient, chainConfig, fetchedConfig);
}
