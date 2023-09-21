import { isAddressAdmin } from '@hooks/useAdmin';
import { Chains } from '@hooks/useChain/Chains';

export function isV2Enabled(chain: Chains, address: string | undefined) {
  if (chain === Chains.Osmosis) {
    return true;
  }
  return true || isAddressAdmin(address);
}
