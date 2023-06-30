import { useMetamask } from '@hooks/useMetamask';
import { useWallet } from '@hooks/useWallet';
import { useConfig } from '@hooks/useConfig';
import { useChain } from '@hooks/useChain';
import getClient from './getClient';

export function useCalcSigningClient() {
  const { chainConfig } = useChain();
  const fetchedConfig = useConfig();
  const evmSigner = useMetamask((state) => state.signer);
  const { signingClient: cosmSigner } = useWallet();

  if (!chainConfig) return null;

  return getClient(chainConfig, fetchedConfig, evmSigner, cosmSigner);
}
