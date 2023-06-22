import { Chains } from '@hooks/useChain/Chains';
import { useMetamask } from '@hooks/useMetamask';
import { useWallet } from '@hooks/useWallet';
import getClient from './getClient';

export function useCalcSigningClient(chain: Chains) {
  const evmSigner = useMetamask((state) => state.signer);
  const { signingClient: cosmSigner } = useWallet();

  if (!chain) return null;

  return getClient(chain, evmSigner, cosmSigner);
}
