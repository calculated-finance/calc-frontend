import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@wizard-ui/react';
import { isNumber } from 'lodash';
import { findPair } from '../helpers/findPair';
import usePairs from './usePairs';
import { Denom } from '../models/Denom';
import { PositionType } from './useStrategies';

function safeInvert(value: number) {
  if (!value) {
    return 0;
  }

  if (!isNumber(value)) {
    return 0;
  }

  return 1 / value;
}

export default function usePrice(
  positionType: PositionType,
  resultingDenom: Denom | undefined,
  initialDenom: Denom | undefined,
) {
  const { client } = useWallet();

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pairAddress = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

  const { data, ...helpers } = useQuery<any>(
    ['price', pairAddress, client],
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

  const price =
    positionType === 'enter' ? Number(data?.quote[0].quote_price) : safeInvert(Number(data?.base[0].quote_price));

  const formattedPrice = price
    ? price.toLocaleString('en-US', {
        maximumFractionDigits: 6,
        minimumFractionDigits: 2,
      })
    : undefined;

  return {
    price: formattedPrice,
    pairAddress,
    ...helpers,
  };
}
