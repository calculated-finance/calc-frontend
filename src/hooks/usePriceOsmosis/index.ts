import { BookResponse } from 'kujira.js/lib/cjs/fin';
import { TransactionType } from '@components/TransactionType';
import { findPair } from '@helpers/findPair';
import { Denom } from '@models/Denom';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { Chains, useChain } from '@hooks/useChain';
import { useOsmosis } from '@hooks/useOsmosis';
import Long from 'long';
import { safeInvert } from '@hooks/usePrice';
import useQueryWithNotification from '../useQueryWithNotification';
import usePairs from '../usePairs';

export default function usePriceOsmosis(
  resultingDenom: Denom | undefined,
  initialDenom: Denom | undefined,
  transactionType: TransactionType,
  enabled: boolean,
) {
  const client = useCosmWasmClient((state) => state.client);
  const query = useOsmosis((state) => state.query);

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pair =
    pairs && resultingDenom && initialDenom
      ? findPair(
          pairs,
          transactionType === TransactionType.Buy ? resultingDenom : initialDenom,
          transactionType === TransactionType.Buy ? initialDenom : resultingDenom,
        )
      : null;

  const { data, ...helpers } = useQueryWithNotification<any>(
    ['price-osmosis', pair, client],
    async () => {
      const result = query.osmosis.poolmanager.v1beta1.estimateSwapExactAmountIn({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        poolId: Long.fromNumber(pair.pool_id, true),
        tokenIn: `1000000${resultingDenom}`,
        routes: [
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            poolId: Long.fromNumber(pair.pool_id, true),
            tokenOutDenom: initialDenom,
          },
        ],
      });
      return result;
    },
    {
      enabled: !!client && !!pair && !!enabled,
    },
  );
  // query.osmosis.gamm.v1beta1
  // .spotPrice({
  //   poolId: Long.fromNumber(pair.pool_id, true),
  //   baseAssetDenom: initialDenom,
  //   quoteAssetDenom: resultingDenom,
  // })
  // .then((res) => console.log(res));

  const price =
    data &&
    (transactionType === TransactionType.Buy
      ? Number(data.tokenOutAmount) / 1000000
      : safeInvert(Number(data.tokenOutAmount) / 1000000));

  const formattedPrice = price
    ? price.toLocaleString('en-US', {
        maximumFractionDigits: 3,
        minimumFractionDigits: 3,
      })
    : undefined;

  return {
    price: formattedPrice,
    pairAddress: pair?.address,
    ...helpers,
  };
}
