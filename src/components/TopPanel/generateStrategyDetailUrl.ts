import { ChainId } from '@models/ChainId';

export function generateStrategyDetailUrl(id: string | undefined, chainId?: ChainId) {
  return { pathname: '/strategies/details', query: { id, chain: chainId } };
}
