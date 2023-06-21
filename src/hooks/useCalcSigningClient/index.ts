import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Chains } from '@hooks/useChain/Chains';
import { useMetamask } from '@hooks/useMetamask';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useWallet } from '@hooks/useWallet';
import { Strategy } from '@models/Strategy';
import { executeTopUpCosmos } from './executeTopUpCosmos';
import { executeTopUpEVM } from './executeTopUpEVM';

function getClient(
  chain: Chains,
  evmProvider: BrowserProvider | null,
  evmSigner: JsonRpcSigner | null,
  cosmSigner: SigningCosmWasmClient | null | undefined,
) {
  if (chain === Chains.Moonbeam) {
    if (!evmProvider) return null;
    if (!evmSigner) return null;

    return {
      topUpStrategy: (address: string, strategy: Strategy, topUpAmount: number) =>
        executeTopUpEVM(evmProvider, evmSigner, strategy, topUpAmount),
    };
  }

  if (chain === Chains.Kujira) {
    if (!cosmSigner) return null;

    return {
      topUpStrategy: (address: string, strategy: Strategy, topUpAmount: number) =>
        executeTopUpCosmos(address, cosmSigner, chain, strategy, topUpAmount),
    };
  }

  if (chain === Chains.Osmosis) {
    if (!cosmSigner) return null;

    return {
      topUpStrategy: (address: string, strategy: Strategy, topUpAmount: number) =>
        executeTopUpCosmos(address, cosmSigner, chain, strategy, topUpAmount),
    };
  }

  throw new Error('Unsupported chain');
}

export function useCalcSigningClient(chain: Chains) {
  const evmProvider = useMetamask((state) => state.provider);
  const evmSigner = useMetamask((state) => state.signer);
  const { signingClient: cosmSigner } = useWallet();

  if (!chain) return null;

  return getClient(chain, evmProvider, evmSigner, cosmSigner);
}
