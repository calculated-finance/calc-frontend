import { useWallet } from '@hooks/useWallet';
import { useConfig } from '@hooks/useConfig';
import { useChainId } from '@hooks/useChainId';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useQuery } from '@tanstack/react-query';
import getClient from './getClient';

export function useCalcSigningClient() {
  const { chainId, chainConfig } = useChainId();
  const fetchedConfig = useConfig();
  const { connected, getSigningClient } = useWallet();

  const { data: signingClient, ...other } = useQuery<SigningCosmWasmClient | null>(
    ['signingClient', chainId],
    () => getSigningClient!(),
    {
      enabled: !!connected && !!getSigningClient,
      meta: {
        errorMessage: 'Error fetching signing client',
      },
    },
  );

  return { calcSigningClient: getClient(chainConfig, fetchedConfig, signingClient), ...other };
}
