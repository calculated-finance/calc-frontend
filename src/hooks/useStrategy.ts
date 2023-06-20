import { useWallet } from '@hooks/useWallet';
import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { VaultResponse } from 'src/interfaces/v2/generated/response/get_vault';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Strategy } from '../models/Strategy';
import { isAddressAdmin } from './useAdmin';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';
import { Chains } from './useChain/Chains';
import { useMetamask } from './useMetamask';
import { fetchStrategy } from './fetchStrategy';

export const STRATEGY_KEY = 'strategy';

async function fetchStrategyCosmos(client: CosmWasmClient, chain: Chains, id: string | undefined): Promise<Strategy> {
  const result = (await client.queryContractSmart(getChainContractAddress(chain), {
    get_vault: {
      vault_id: id,
    },
  } as QueryMsg)) as VaultResponse;

  return result.vault;
}

export default function useStrategy(id: Strategy['id'] | undefined) {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);
  const provider = useMetamask((state) => state.provider);

  return useQuery<Strategy>(
    [STRATEGY_KEY, id, client, address],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      if (!chain) {
        throw new Error('No chain');
      }
      if (!id) {
        throw new Error('No id');
      }
      if (!address) {
        throw new Error('No address');
      }

      let result;
      if (chain === Chains.Moonbeam) {
        if (!provider) {
          throw new Error('No provider');
        }

        result = await fetchStrategy(id, provider);
      } else {
        result = await fetchStrategyCosmos(client, chain, id);
      }

      if (result.owner !== address && !isAddressAdmin(address)) {
        console.log('result.owner', result.owner);
        console.log('address', address);
        console.log('isAddressAdmin(address)', isAddressAdmin(address));
        throw new Error('Strategy not found');
      }

      return result;
    },
    {
      enabled: !!client && !!id && !!address && !!chain,
      meta: {
        errorMessage: 'Error fetching strategy',
      },
    },
  );
}
