import { ChainId } from '@models/ChainId';

export function generateStrategyCustomiseUrl(id: string | undefined, chainId?: ChainId) {
  return { pathname: '/strategies/customise/', query: { id, chain: chainId } };
}
