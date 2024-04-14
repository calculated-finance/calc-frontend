import { ChainId } from '@models/ChainId';

export function generateStrategyTopUpUrl(id: string | undefined, chainId?: ChainId) {
  return { pathname: '/strategies/top-up/', query: { id, chain: chainId } };
}
