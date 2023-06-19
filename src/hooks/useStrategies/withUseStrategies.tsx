import { Chains } from '@hooks/useChain/Chains';
import { useChain } from '@hooks/useChain';
import { UseQueryResult } from '@tanstack/react-query';
import { Strategy, useStrategiesCosmos, useStrategiesEVM } from './useStrategies';

export type WithUseStrategyProps = {
  useStrategies: () => UseQueryResult<Strategy[], unknown> 
} ;

export function withUseStrategies<T extends WithUseStrategyProps>(OriginalComponent: React.ComponentType<T>) {

  function NewComponent(props: any) {
    const { chain } = useChain();
    const useStrategies = chain === Chains.Moonbeam ? useStrategiesEVM : useStrategiesCosmos;
    return (<OriginalComponent useStrategies={useStrategies} {...props} />);
  }
  return NewComponent;
};
