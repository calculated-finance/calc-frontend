import { isAddressAdmin } from '@hooks/useAdmin';
import { Chains } from '@hooks/useChain/Chains';
import { featureFlags } from 'src/constants';

export function isV2Enabled(chain: Chains, address: string | undefined) {
  if (chain === Chains.Osmosis) {
    return true;
  }
  return featureFlags.isKujiraV2Enabled || isAddressAdmin(address);
}
