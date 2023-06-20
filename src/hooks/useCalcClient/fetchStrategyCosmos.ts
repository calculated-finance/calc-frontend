import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { VaultResponse } from 'src/interfaces/v2/generated/response/get_vault';
import { getChainContractAddress } from '@helpers/chains';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Strategy } from '../../models/Strategy';
import { Chains } from '../useChain/Chains';

export async function fetchStrategyCosmos(
  client: CosmWasmClient,
  chain: Chains,
  id: string | undefined,
): Promise<Strategy> {
  const result = (await client.queryContractSmart(getChainContractAddress(chain), {
    get_vault: {
      vault_id: id,
    },
  } as QueryMsg)) as VaultResponse;

  return result.vault;
}
