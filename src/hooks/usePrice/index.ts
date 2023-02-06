import { useWallet } from '@wizard-ui/react';
import { isNumber } from 'lodash';
import { BookResponse } from 'kujira.js/lib/cjs/fin';
import { TransactionType } from '@components/TransactionType';
import getDenomInfo from '@utils/getDenomInfo';
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
  const { offer_denom: baseOfferDenom } = basePriceInfo;
  let priceDeconversion;
  if ('native' in baseOfferDenom) {
    priceDeconversion = getDenomInfo(baseOfferDenom.native).priceDeconversion;
  } else if ('cw20' in baseOfferDenom) {
    priceDeconversion = getDenomInfo(baseOfferDenom.cw20).priceDeconversion;
  } else {
    priceDeconversion = getDenomInfo(baseOfferDenom).priceDeconversion;
  }

  // the quote denom may be a string, or shown as an object with native info
  if (typeof offer_denom === 'string') {
    if (offer_denom === initialDenom) {
      // return the price of the base
      if (transactionType === 'buy') {
        return priceDeconversion(Number(basePriceInfo.quote_price));
      }
      return safeInvert(priceDeconversion(Number(basePriceInfo.quote_price)));
    }
  } else if ('native' in offer_denom) {
    if (offer_denom.native === initialDenom) {
      // return the price of the base
      if (transactionType === 'buy') {
        return priceDeconversion(Number(basePriceInfo.quote_price));
      }
      return safeInvert(priceDeconversion(Number(basePriceInfo.quote_price)));
    }
  }

  // case 2: we are going base -> quote
  // return the price of the base
  return priceDeconversion(Number(quotePriceInfo.quote_price));
}

export default function usePrice(
  resultingDenom: Denom | undefined,
  initialDenom: Denom | undefined,
  transactionType: TransactionType,
  enabled = true,
) {
  const { client } = useWallet();

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pairAddress = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

  console.log('pairAddress', pairAddress);

  const { data, ...helpers } = useQueryWithNotification<BookResponse>(
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
      enabled: !!client && !!pairAddress && enabled,
    },
  );
  const price = data && calculatePrice(data, initialDenom!, transactionType);

  const formattedPrice = price
    ? price.toLocaleString('en-US', {
        maximumFractionDigits: 3,
        minimumFractionDigits: 3,
      })
    : undefined;

  return {
    price: formattedPrice,
    rawPrice: price,
    pairAddress,
    ...helpers,
  };
}
