import { Chains } from '@hooks/useChain/Chains';
import { useMetamask } from '@hooks/useMetamask';
import { useWallet } from '@hooks/useWallet';
import { getChainConfig } from '@helpers/chains';
import { useConfig } from '@hooks/useConfig';
import getClient from './getClient';

export function useCalcSigningClient(chain: Chains) {
  const fetchedConfig = useConfig();
  const evmSigner = useMetamask((state) => state.signer);
  const { signingClient: cosmSigner } = useWallet();

  const chainConfig = getChainConfig(chain);

  if (!chainConfig) return null;

  return getClient(chainConfig, fetchedConfig, evmSigner, cosmSigner);
}
