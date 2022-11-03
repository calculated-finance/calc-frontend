import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@wizard-ui/react';
import { isNumber } from 'lodash';
import { findPair } from '../helpers/findPair';
import usePairs from './usePairs';
import { Denom } from '../models/Denom';

type PriceAndOffer = {
  quote_price: string;
  offer_denom: {
    native: string;
  };
  total_offer_amount: string;
};

type BookResult = {
  base: PriceAndOffer[];
  quote: PriceAndOffer[];
};

function safeInvert(value: number) {
  if (!value) {
    return 0;
  }

  if (!isNumber(value)) {
    return 0;
  }

  return 1 / value;
}

function calculatePrice(result: BookResult, initialDenom: Denom) {
  if (result.quote[0].offer_denom.native === initialDenom) {
    return Number(result.quote[0].quote_price);
  }
  return safeInvert(Number(result.base[0].quote_price));
}

export default function usePrice(resultingDenom: Denom | undefined, initialDenom: Denom | undefined) {
  const { client } = useWallet();

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pairAddress = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

  const { data, ...helpers } = useQuery<BookResult>(
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
  const price = data && calculatePrice(data, initialDenom!);

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
