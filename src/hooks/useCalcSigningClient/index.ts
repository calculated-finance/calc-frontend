import { useMetamask } from '@hooks/useMetamask';
import { useWallet } from '@hooks/useWallet';
import { useConfig } from '@hooks/useConfig';
import { useChain } from '@hooks/useChain';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useEffect, useState } from 'react';
import getClient from './getClient';

export function useCalcSigningClient() {
  const { chainConfig } = useChain();
  const fetchedConfig = useConfig();
  const evmSigner = useMetamask((state) => state.signer);
  const { getSigningClient } = useWallet();

  const [cosmSigner, setCosmSigner] = useState<SigningCosmWasmClient | null>(null);

  useEffect(() => {
    if (!getSigningClient) return;

    getSigningClient().then(setCosmSigner);
  }, [getSigningClient]);

  if (!chainConfig) return null;

  return getClient(chainConfig, fetchedConfig, evmSigner, cosmSigner);
}
