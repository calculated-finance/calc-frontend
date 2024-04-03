import { ChainId } from '@models/ChainId';
import { Strategy, StrategyStatus } from '@models/Strategy';
import { InitialDenomInfo, fromPartial } from '@utils/DenomInfo';
import { VaultStatus } from 'src/interfaces/dca/query';
import { Vault } from 'src/interfaces/dca/response/get_vault';

const vaultStatusMap: Record<VaultStatus, StrategyStatus> = {
  active: StrategyStatus.ACTIVE,
  cancelled: StrategyStatus.CANCELLED,
  scheduled: StrategyStatus.SCHEDULED,
  inactive: StrategyStatus.COMPLETED,
};

export function transformToStrategyCosmos(
  vaultData: Vault,
  getDenomById: (denom: string) => InitialDenomInfo | undefined,
  chainId: ChainId,
): Strategy {
  return {
    chainId,
    id: vaultData.id,
    owner: vaultData.owner,
    status: vaultStatusMap[vaultData.status],
    initialDenom: getDenomById(vaultData.balance.denom) ?? fromPartial({ id: vaultData.balance.denom, chain: chainId }),
    resultingDenom:
      getDenomById(vaultData.received_amount.denom) ?? fromPartial({ id: vaultData.balance.denom, chain: chainId }),
    rawData: vaultData,
  };
}
