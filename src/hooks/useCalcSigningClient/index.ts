import { useMetamask } from '@hooks/useMetamask';
import { useWallet } from '@hooks/useWallet';
import { useConfig } from '@hooks/useConfig';
import { useChain } from '@hooks/useChain';
import getClient from './getClient';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useQuery } from '@tanstack/react-query';

export function useCalcSigningClient() {
  const { chainConfig } = useChain();
  const fetchedConfig = useConfig();
  const evmSigner = useMetamask((state) => state.signer);
  const { getSigningClient } = useWallet();

  const queryResult = useQuery<SigningCosmWasmClient | null>(
    ['signingClient', getSigningClient],
    async () => (getSigningClient && (await getSigningClient())) ?? null,
    {
      enabled: !!getSigningClient,
    },
  );

  if (!chainConfig) return null;

  if (!queryResult?.data) {
    return null;
  }

  return getClient(chainConfig, fetchedConfig, evmSigner, queryResult.data);
}
