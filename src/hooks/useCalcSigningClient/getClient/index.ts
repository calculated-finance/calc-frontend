import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Chains } from '@hooks/useChain/Chains';
import { JsonRpcSigner } from 'ethers';
import { getEVMSigningClient } from './clients/evm';
import { getCosmosSigningClient } from './clients/cosmos';

export default function getClient(
  chain: Chains,
  evmSigner: JsonRpcSigner | null,
  cosmSigner: SigningCosmWasmClient | null | undefined,
) {
  if (chain === Chains.Moonbeam) {
    if (!evmSigner) return null;

    return getEVMSigningClient(evmSigner);
  }

  if (chain === Chains.Kujira) {
    if (!cosmSigner) return null;

    return getCosmosSigningClient(cosmSigner, chain);
  }

  if (chain === Chains.Osmosis) {
    if (!cosmSigner) return null;

    return getCosmosSigningClient(cosmSigner, chain);
  }

  throw new Error('Unsupported chain');
}
