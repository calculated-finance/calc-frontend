import { Chains } from '@hooks/useChain';
import { featureFlags } from 'src/constants';

export function isV2Enabled(chain: Chains) {
  if (chain === Chains.Osmosis) {
    return true;
  }
  return featureFlags.isKujiraV2Enabled;
}
