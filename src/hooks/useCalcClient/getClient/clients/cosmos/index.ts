import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { VaultResponse } from 'src/interfaces/v2/generated/response/get_vault';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Strategy } from '@models/Strategy';

async function fetchStrategy(client: CosmWasmClient, address: string, id: string | undefined): Promise<Strategy> {
  const result = (await client.queryContractSmart(address, {
    get_vault: {
      vault_id: id,
    },
  } as QueryMsg)) as VaultResponse;

  return result.vault;
}

export default function getCosmosClient(address: string, cosmClient: CosmWasmClient) {
  return {
    fetchStrategy: (id: string) => fetchStrategy(cosmClient, address, id),
  };
}
