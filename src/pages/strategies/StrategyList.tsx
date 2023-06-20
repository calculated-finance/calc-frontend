import StrategyRow from '@components/StrategyRow';
import { Strategy } from '@models/Strategy';

export function StrategyList({ strategies = [] }: { strategies: Strategy[] }) {
  return (
    <>
      {strategies.map((strategy: Strategy) => (
        <StrategyRow key={strategy.id} strategy={strategy} />
      ))}
    </>
  );
}
