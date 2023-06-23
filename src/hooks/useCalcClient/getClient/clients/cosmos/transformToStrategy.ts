import { Strategy } from '@models/Strategy';
import { Vault } from 'src/interfaces/v2/generated/response/get_vault';

export function transformToStrategy(vaultData: Vault) {
  return {
    rawData: vaultData,
  } as Strategy;
}
