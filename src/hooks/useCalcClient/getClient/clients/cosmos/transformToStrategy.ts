import { Strategy } from '@models/Strategy';
import { Vault } from 'src/interfaces/v2/generated/response/get_vault';

export function transformToStrategyCosmos(vaultData: Vault): Strategy {
  return {
    id: vaultData.id,
    owner: vaultData.owner,
    status: vaultData.status,
    rawData: vaultData,
  };
}
