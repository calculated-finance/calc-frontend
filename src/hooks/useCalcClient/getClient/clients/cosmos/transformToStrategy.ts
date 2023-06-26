import { Strategy, StrategyStatus } from '@models/Strategy';
import { VaultStatus } from 'src/interfaces/v2/generated/query';
import { Vault } from 'src/interfaces/v2/generated/response/get_vault';

const vaultStatusMap: Record<VaultStatus, StrategyStatus> = {
  active: StrategyStatus.ACTIVE,
  cancelled: StrategyStatus.CANCELLED,
  scheduled: StrategyStatus.SCHEDULED,
  inactive: StrategyStatus.COMPLETED,
};

function getStrategyStatus(vault: Vault) {
  return vaultStatusMap[vault.status];
}

export function transformToStrategyCosmos(vaultData: Vault): Strategy {
  return {
    id: vaultData.id,
    owner: vaultData.owner,
    status: getStrategyStatus(vaultData),
    rawData: vaultData,
  };
}
