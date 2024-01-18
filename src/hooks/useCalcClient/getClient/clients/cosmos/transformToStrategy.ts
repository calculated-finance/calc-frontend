import { ChainId } from '@hooks/useChainId/Chains';
import { Strategy, StrategyStatus } from '@models/Strategy';
import { DenomInfo, fromPartial } from '@utils/DenomInfo';
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
  getDenomById: (denom: string) => DenomInfo | undefined,
  chainId: ChainId,
): Strategy {
  return {
    id: vaultData.id,
    owner: vaultData.owner,
    status: vaultStatusMap[vaultData.status],
    initialDenom: getDenomById(vaultData.balance.denom) ?? fromPartial({ id: vaultData.balance.denom, chain: chainId }),
    resultingDenom:
      getDenomById(vaultData.received_amount.denom) ?? fromPartial({ id: vaultData.balance.denom, chain: chainId }),
    rawData: vaultData,
  };
}
