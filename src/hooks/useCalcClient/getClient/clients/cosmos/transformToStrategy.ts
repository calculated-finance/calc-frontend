import { Strategy, StrategyStatus } from '@models/Strategy';
import { DenomInfo } from '@utils/DenomInfo';
import { VaultStatus } from 'src/interfaces/v2/generated/query';
import { Vault } from 'src/interfaces/v2/generated/response/get_vault';

const vaultStatusMap: Record<VaultStatus, StrategyStatus> = {
  active: StrategyStatus.ACTIVE,
  cancelled: StrategyStatus.CANCELLED,
  scheduled: StrategyStatus.SCHEDULED,
  inactive: StrategyStatus.COMPLETED,
};

export function transformToStrategyCosmos(
  vaultData: Vault,
  getDenomInfo: (denom: string) => DenomInfo | undefined,
): Strategy {
  return {
    id: vaultData.id,
    owner: vaultData.owner,
    status: vaultStatusMap[vaultData.status],
    initialDenom: getDenomInfo(vaultData.balance.denom)!,
    resultingDenom: getDenomInfo(vaultData.received_amount.denom)!,
    rawData: vaultData,
  };
}
