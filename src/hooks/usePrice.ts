import { useQuery } from '@tanstack/react-query';
import { useCWClient } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { findPair } from './findPair';
import usePairs, { Denom } from './usePairs';
import { PositionType } from './useStrategies';

export default function usePrice(
  positionType: PositionType,
  resultingDenom: Denom | undefined,
  initialDenom: Denom | undefined,
) {
  const client = useCWClient();

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pairAddress =
    pairs && resultingDenom && initialDenom ? findPair(positionType, pairs, resultingDenom, initialDenom) : null;

  const { data, ...helpers } = useQuery<any>(
    ['price', pairAddress],
    async () => {
      const result = await client!.queryContractSmart(pairAddress!, {
        book: {
          limit: 1,
        },
      });
      return result;
    },
    {
      enabled: !!client && !!pairAddress,
    },
  );

  const price = positionType === 'enter' ? data?.quote[0].quote_price : data?.base[0].quote_price;

  return {
    price,
    pairAddress,
    ...helpers,
  };
}
