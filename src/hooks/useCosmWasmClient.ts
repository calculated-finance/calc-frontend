import { useQuery } from '@tanstack/react-query';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { keys } from 'rambda';
import { ChainId } from './useChain/Chains';
import { useChainId } from './useChain';
import { useCosmosKit } from './useCosmosKit';

export function useCosmWasmClient(injectedChainId?: ChainId) {
  const { chainId } = useChainId();
  const chainContext = useCosmosKit(injectedChainId ?? chainId);

  const { data: cosmWasmClient } = useQuery<CosmWasmClient | null>(
    ['cosmWasmClient', injectedChainId ?? chainId],
    async () => {
      const client = await chainContext!.getCosmWasmClient();

      const originalFn = client.queryContractSmart;

      client.queryContractSmart = async function (address: any, query: any) {
        try {
          const result = await originalFn.apply(this, [address, query]);
          console.log('QUERY', address, keys(query)[0]);
          console.log('RESULT', result);
          return result;
        } catch (error) {
          console.log('QUERY', address, query, client);
          console.log('ERROR', error);
          throw error;
        }
      };

      return client;
    },
    {
      enabled: !!(injectedChainId ?? chainId) && !!chainContext,
    },
  );

  return {
    cosmWasmClient,
  };
}
