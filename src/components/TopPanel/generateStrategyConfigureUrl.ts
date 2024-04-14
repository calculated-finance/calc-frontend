import { ChainId } from '@models/ChainId';

export function generateStrategyConfigureUrl(id: string | undefined, chainId?: ChainId) {
  return { pathname: '/strategies/configure/', query: { id, chain: chainId } };
}
