import { Chains } from '@hooks/useChain/Chains';
import { useMetamask } from '@hooks/useMetamask';
import { useWallet } from '@hooks/useWallet';
import { getChainConfig } from '@helpers/chains';
import getClient from './getClient';

export function useCalcSigningClient(chain: Chains) {
  const evmSigner = useMetamask((state) => state.signer);
  const { signingClient: cosmSigner } = useWallet();

  const chainConfig = getChainConfig(chain);

  if (!chainConfig) return null;

  return getClient(chainConfig, evmSigner, cosmSigner);
}
