import { useChain } from '@hooks/useChain';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { LoadingState } from './LoadingState';

export function ChainWrapper({ children }: ChildrenProp) {
  const { chain, isLoading } = useChain();

  if (isLoading) {
    return <LoadingState />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return chain ? <>{children}</> : <LoadingState />;
}
