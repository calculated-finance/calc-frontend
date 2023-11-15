import { useMetamask } from '@hooks/useMetamask';
import { useWallet } from '@hooks/useWallet';
import { useConfig } from '@hooks/useConfig';
import { useChain } from '@hooks/useChain';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useQuery } from '@tanstack/react-query';
import getClient from './getClient';

export function useCalcSigningClient() {
  const { chainConfig } = useChain();
  const fetchedConfig = useConfig();
  const evmSigner = useMetamask((state) => state.signer);
  const { getSigningClient } = useWallet();

  const { data: signingClient } = useQuery<SigningCosmWasmClient | null>(
    ['signingClient', getSigningClient],
    () => getSigningClient!(),
    {
      enabled: !!getSigningClient,
      meta: {
        errorMessage: 'Error fetching signing client',
      },
    },
  );

  if (!chainConfig || !signingClient) return null;

  return getClient(chainConfig, fetchedConfig, evmSigner, signingClient);
}
