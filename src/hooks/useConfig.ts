import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { Config, ConfigResponse } from 'src/interfaces/v2/generated/response/get_config';
import { useChainId } from './useChainId';
import { useCosmWasmClient } from './useCosmWasmClient';
import { ChainId } from '@models/ChainId';

export function useConfig(injectedChainId?: ChainId): Config | undefined {
  const { chainId: currentChainId } = useChainId();
  const { cosmWasmClient } = useCosmWasmClient();
  const chainId = injectedChainId ?? currentChainId;

  const { data: response } = useQuery<ConfigResponse>(
    ['config', chainId],
    () =>
      cosmWasmClient!.queryContractSmart(getChainContractAddress(chainId!), {
        get_config: {},
      }),
    {
      enabled: !!chainId && !!cosmWasmClient,
      meta: {
        errorMessage: 'Error fetching config',
      },
    },
  );

  return response && response.config;
}
