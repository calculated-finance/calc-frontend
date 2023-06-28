import { Chains } from '@hooks/useChain/Chains';
import { useMetamask } from '@hooks/useMetamask';
import { useWallet } from '@hooks/useWallet';
import { ChainConfig } from '@helpers/chains';
import getClient from './getClient';

export function useCalcSigningClient(chainConfig: ChainConfig) {
  const evmSigner = useMetamask((state) => state.signer);
  const { signingClient: cosmSigner } = useWallet();

  if (!chainConfig) return null;

  return getClient(chainConfig, evmSigner, cosmSigner);
}
