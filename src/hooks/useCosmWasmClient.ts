import { useQuery } from '@tanstack/react-query';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainId } from './useChain/Chains';
import { useChain } from './useChain';
import { useCosmosKit } from './useCosmosKit';

export function useCosmWasmClient(injectedChain?: ChainId) {
  const { chain } = injectedChain ? { chain: injectedChain } : useChain();
  const chainContext = useCosmosKit(chain);

  const { data: cosmWasmClient } = useQuery<CosmWasmClient | null>(
    ['cosmWasmClient', chain],
    async () => {
      console.log('cosmWasmClient', chain, chainContext);

      const client = await chainContext!.getCosmWasmClient();

      const originalFn = client.queryContractSmart;

      client.queryContractSmart = async function (address: any, query: any) {
        try {
          const result = await originalFn.apply(this, [address, query]);
          console.log('QUERY', address, query, chainContext?.chain.chain_name, client);
          console.log('RESULT', result);
          return result;
        } catch (error) {
          console.log('QUERY', address, query, chainContext, client);
          console.log('ERROR', error);
          throw error;
        }
      };

      return client;
    },
    {
      enabled: !!chainContext,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      retry: false,
    },
  );

  return {
    cosmWasmClient,
  };
}
