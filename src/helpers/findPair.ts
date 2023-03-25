import { isDenomStable } from '@utils/getDenomInfo';
import { Pool } from '@models/Pool';
import { Denom } from '@models/Denom';

export function findPool(pools: Pool[], resultingDenom: Denom, initialDenom: Denom) {
  if (isDenomStable(initialDenom)) {
    return pools?.find((pool: Pool) => pool.base_denom === resultingDenom && pool.quote_denom === initialDenom)
      ?.pool_id;
  }

  const initialAsQuote = pools?.find(
    (pool: Pool) => pool.base_denom === resultingDenom && pool.quote_denom === initialDenom,
  )?.pool_id;

  if (initialAsQuote) {
    return initialAsQuote;
  }
  return pools?.find((pool: Pool) => pool.base_denom === initialDenom && pool.quote_denom === resultingDenom)?.pool_id;
}
