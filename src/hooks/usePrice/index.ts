import { max } from 'lodash';
import { BookResponse, Decimal } from 'kujira.js/lib/cjs/fin';
import { TransactionType } from '@components/TransactionType';
import getDenomInfo from '@utils/getDenomInfo';
import { findPair } from '@helpers/findPair';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import usePriceOsmosis from '@hooks/usePriceOsmosis';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import usePairs from '../usePairs';
import { safeInvert } from './safeInvert';
import { useConfig } from '@hooks/useConfig';
import { getPairAddress } from 'src/fixtures/addresses';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Pair } from '@models/Pair';
import { Config } from 'src/interfaces/v2/generated/response/get_config';

function calculatePrice(result: BookResponse, initialDenom: DenomInfo, transactionType: TransactionType) {
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
    priceDeconversion = getDenomInfo(baseOfferDenom.native)?.priceDeconversion;
  } else if ('cw20' in baseOfferDenom) {
    priceDeconversion = getDenomInfo(baseOfferDenom.cw20)?.priceDeconversion;
  } else {
    priceDeconversion = getDenomInfo(baseOfferDenom)?.priceDeconversion;
  }

  // the quote denom may be a string, or shown as an object with native info
  if (typeof offer_denom === 'string') {
    if (offer_denom === initialDenom.id) {
      // return the price of the base
      if (transactionType === 'buy') {
        return priceDeconversion(Number(basePriceInfo.quote_price));
      }
      return safeInvert(priceDeconversion(Number(basePriceInfo.quote_price)));
    }
  } else if ('native' in offer_denom) {
    if (offer_denom.native === initialDenom.id) {
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
  resultingDenom: DenomInfo | undefined,
  initialDenom: DenomInfo | undefined,
  transactionType: TransactionType,
  enabled = true,
) {
  const { chain } = useChain();

  const osmosisPrice = usePriceOsmosis(
    resultingDenom,
    initialDenom,
    transactionType,
    chain === Chains.Osmosis && enabled,
  );

  const client = useCosmWasmClient((state) => state.client);

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pair = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

  let config = useConfig();

  const isV3Enabled = !!client && !!pair && chain === Chains.Kujira && enabled && !!config?.exchange_contract_address;

  const v3Price = usePriceV3(client, resultingDenom, initialDenom, config, isV3Enabled);

  const kujiraPrice = usePriceKujira(
    client,
    resultingDenom,
    initialDenom,
    pair,
    transactionType,
    !!client && !!pair && chain === Chains.Kujira && !config?.exchange_contract_address && enabled,
  );

  if (isV3Enabled) {
    return v3Price;
  }

  if (chain === Chains.Osmosis) {
    return osmosisPrice;
  }

  return kujiraPrice;
}

function usePriceKujira(
  client: CosmWasmClient | null,
  resultingDenom: DenomInfo | undefined,
  initialDenom: DenomInfo | undefined,
  pair: Pair | null | undefined,
  transactionType: TransactionType,
  enabled = true,
) {
  const { data, ...helpers } = useQuery<BookResponse>(
    ['price', pair, client],
    async () => {
      const result = await client!.queryContractSmart(getPairAddress(initialDenom!.id, resultingDenom!.id)!, {
        book: {
          limit: 1,
        },
      });
      return result;
    },
    {
      enabled,
      meta: {
        errorMessage: 'Error fetching price',
      },
    },
  );

  const price = data && calculatePrice(data, initialDenom!, transactionType);

  const pricePrecision = max([initialDenom?.pricePrecision || 0, resultingDenom?.pricePrecision || 0]);

  const formattedPrice = price
    ? price.toLocaleString('en-US', {
        maximumFractionDigits: pricePrecision || 3,
        minimumFractionDigits: 3,
      })
    : undefined;

  return {
    formattedPrice,
    price,
    ...helpers,
  };
}

function usePriceV3(
  client: CosmWasmClient | null,
  resultingDenom: DenomInfo | undefined,
  initialDenom: DenomInfo | undefined,
  config: Config | undefined,
  enabled = true,
) {
  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pair = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

  const { data, ...helpers } = useQuery<number>(
    ['price', pair, client, config],
    async () => {
      return await client!.queryContractSmart(config!.exchange_contract_address, {
        get_twap_to_now: {
          swap_denom: initialDenom!.id,
          target_denom: resultingDenom!.id,
          period: config!.twap_period,
        },
      });
    },
    {
      enabled,
      meta: {
        errorMessage: 'Error fetching price',
      },
    },
  );

  const price = data;

  const pricePrecision = max([initialDenom?.pricePrecision || 0, resultingDenom?.pricePrecision || 0]);

  const formattedPrice = price
    ? price.toLocaleString('en-US', {
        maximumFractionDigits: pricePrecision || 3,
        minimumFractionDigits: 3,
      })
    : undefined;

  return {
    formattedPrice,
    price,
    ...helpers,
  };
}
