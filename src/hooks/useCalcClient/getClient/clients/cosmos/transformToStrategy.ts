import { Strategy } from '@models/Strategy';
import { Vault } from 'src/interfaces/v2/generated/response/get_vault';

function getStrategyStatus(vault: Vault) {
  if (vault.status === 'inactive') {
    return 'completed';
  }
  return vault.status;
}

export function transformToStrategyCosmos(vaultData: Vault): Strategy {
  return {
    id: vaultData.id,
    owner: vaultData.owner,
    status: getStrategyStatus(vaultData),
    rawData: vaultData,
  };
}
