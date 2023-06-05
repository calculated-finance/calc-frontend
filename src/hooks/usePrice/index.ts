import { max } from 'lodash';
import { BookResponse } from 'kujira.js/lib/cjs/fin';
import { TransactionType } from '@components/TransactionType';
import getDenomInfo from '@utils/getDenomInfo';
import { findPair } from '@helpers/findPair';
import { Denom } from '@models/Denom';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { Chains, useChain } from '@hooks/useChain';
import usePriceOsmosis from '@hooks/usePriceOsmosis';
import { useQuery } from '@tanstack/react-query';
import usePairs from '../usePairs';
import { safeInvert } from './safeInvert';

function calculatePrice(result: BookResponse, initialDenom: Denom, transactionType: TransactionType) {
  const quotePriceInfo = result.quote[0];
  const basePriceInfo = result.base[0];

  if (!quotePriceInfo || !basePriceInfo) {
    return 0;
  }

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
  if (transactionType === 'buy') {
    return safeInvert(priceDeconversion(Number(quotePriceInfo.quote_price)));
  }
  return priceDeconversion(Number(quotePriceInfo.quote_price));
}

export default function usePrice(
  resultingDenom: Denom | undefined,
  initialDenom: Denom | undefined,
  transactionType: TransactionType,
  enabled = true,
) {
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pair = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

  const { data, ...helpers } = useQuery<BookResponse>(
    ['price', pair, client],
    async () => {
      const result = await client!.queryContractSmart(pair!.address, {
        book: {
          limit: 1,
        },
      });
      return result;
    },
    {
      enabled: !!client && !!pair && chain === Chains.Kujira && enabled,
      meta: {
        errorMessage: 'Error fetching price',
      },
    },
  );

  const osmosisPrice = usePriceOsmosis(
    resultingDenom,
    initialDenom,
    transactionType,
    chain === Chains.Osmosis && enabled,
  );

  if (chain === Chains.Osmosis) {
    return osmosisPrice;
  }

  const price = data && calculatePrice(data, initialDenom!, transactionType);

  const pricePrecision = max([getDenomInfo(initialDenom).pricePrecision, getDenomInfo(resultingDenom).pricePrecision]);

  const formattedPrice = price
    ? price.toLocaleString('en-US', {
        maximumFractionDigits: pricePrecision || 3,
        minimumFractionDigits: 3,
      })
    : undefined;

  return {
    formattedPrice,
    price,
    pairAddress: pair?.address,
    ...helpers,
  };
}
