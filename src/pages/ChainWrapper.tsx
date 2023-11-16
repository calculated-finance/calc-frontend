import { useChainId } from '@hooks/useChain';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { LoadingState } from './LoadingState';

export function ChainWrapper({ children }: ChildrenProp) {
  const { chainId, isLoading } = useChainId();

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return !isLoading && chainId ? <>{children}</> : <LoadingState />;
}
