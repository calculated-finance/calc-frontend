import { Strategy } from '@hooks/useStrategies';
import { getInitialDenom } from 'src/pages/strategies/[id]/getInitialDenom';

export default function getInitialDenomBalance(strategy: Strategy) {
  const { configuration, balances } = strategy || {};
  const { position_type, pair } = configuration || {};
  const initialDenom = getInitialDenom(position_type, pair);

  const initialDenomBalance = balances?.find((balance) => balance.denom === initialDenom)?.amount;
  return Number(initialDenomBalance);
}
