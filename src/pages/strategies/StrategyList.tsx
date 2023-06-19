import StrategyRow from '@components/StrategyRow';
import { Strategy } from 'src/hooks/useStrategies';

export function StrategyList({ strategies = [] }: { strategies: Strategy[]; }) {

  return (
    <>
      {strategies.map((strategy: Strategy) => <StrategyRow key={strategy.id} strategy={strategy} />)}
    </>
  );
}
