import { useWallet } from '@wizard-ui/react';
import { isNumber } from 'lodash';
import { BookResponse } from 'kujira.js/lib/cjs/fin';
import { TransactionType } from '@components/TransactionType';
import { findPair } from '../../helpers/findPair';
import usePairs from '../usePairs';
import { Denom } from '../../models/Denom';
import useQueryWithNotification from '../useQueryWithNotification';

function safeInvert(value: number) {
  if (!value) {
    return 0;
  }

  if (!isNumber(value)) {
    return 0;
  }

  return 1 / value;
}

function calculatePrice(result: BookResponse, initialDenom: Denom, transactionType: TransactionType) {
  const quotePriceInfo = result.quote[0];
  const basePriceInfo = result.base[0];

  // TODO: change this to look at pair instead

  // case 1: we are going quote -> base
  // check if initialDenom is the quote denom of the pair
  const { offer_denom } = quotePriceInfo;

  // the quote denom may be a string, or shown as an object with native info
  if (typeof offer_denom === 'string') {
    if (offer_denom === initialDenom) {
      // return the price of the base
      if (transactionType === 'buy') {
        return Number(basePriceInfo.quote_price);
      }
      return safeInvert(Number(basePriceInfo.quote_price));
    }
  } else if ('native' in offer_denom) {
    if (offer_denom.native === initialDenom) {
      // return the price of the base
      if (transactionType === 'buy') {
        return Number(basePriceInfo.quote_price);
      }
      return safeInvert(Number(basePriceInfo.quote_price));
    }
  }

  // case 2: we are going base -> quote
  // return the price of the base
  return Number(quotePriceInfo.quote_price);
}

export default function usePrice(
  resultingDenom: Denom | undefined,
  initialDenom: Denom | undefined,
  transactionType: TransactionType,
) {
  const { client } = useWallet();

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pairAddress = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

  const { data, ...helpers } = useQueryWithNotification<BookResponse>(
    ['price', pairAddress, client],
    async () => {
      const result = await client!.queryContractSmart(pairAddress!, {
        book: {
          limit: 1,
        },
      });
      console.log(result);
      return result;
    },
    {
      enabled: !!client && !!pairAddress,
    },
  );
  const price = data && calculatePrice(data, initialDenom!, transactionType);

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
