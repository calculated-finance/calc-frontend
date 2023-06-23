import { max } from 'lodash';
import { BookResponse } from 'kujira.js/lib/cjs/fin';
import { TransactionType } from '@components/TransactionType';
import getDenomInfo from '@utils/getDenomInfo';
import { findPair } from '@helpers/findPair';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import usePriceOsmosis from '@hooks/usePriceOsmosis';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { V2Pair, V3Pair } from '@models/Pair';
import { useConfig } from '@hooks/useConfig';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Config } from 'src/interfaces/v2/generated/response/get_config';
import { getPairAddress } from 'src/fixtures/addresses';
import usePairs from '../usePairs';
import { safeInvert } from './safeInvert';

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

function usePriceKujira(
  client: CosmWasmClient | null,
  resultingDenom: DenomInfo | undefined,
  initialDenom: DenomInfo | undefined,
  pair: V2Pair | null | undefined,
  transactionType: TransactionType,
  enabled = true,
) {
  const { data, ...helpers } = useQuery<number>(
    ['price', pair, client],
    async () => {
      const result = await client!.queryContractSmart(getPairAddress(initialDenom!.id, resultingDenom!.id)!, {
        book: {
          limit: 1,
        },
      });
      return result && calculatePrice(result, initialDenom!, transactionType);
    },
    {
      enabled,
      meta: {
        errorMessage: 'Error fetching price',
      },
    },
  );

  const pricePrecision = max([initialDenom?.pricePrecision || 0, resultingDenom?.pricePrecision || 0]);

  const formattedPrice = data
    ? data.toLocaleString('en-US', {
        maximumFractionDigits: pricePrecision || 3,
        minimumFractionDigits: 3,
      })
    : undefined;

  return {
    formattedPrice,
    price: data,
    ...helpers,
  };
}

function usePriceV3(
  client: CosmWasmClient | null,
  resultingDenom: DenomInfo | undefined,
  initialDenom: DenomInfo | undefined,
  pair: V3Pair | null | undefined,
  config: Config | undefined,
  enabled = true,
) {
  const { data, ...helpers } = useQuery<number>(
    ['price', pair, client],
    async () => {
      const result = await client!.queryContractSmart(config!.exchange_contract_address, {
        get_twap_to_now: {
          swap_denom: pair?.denoms[1],
          target_denom: pair?.denoms[0],
          period: config!.twap_period,
        },
      });
      return (
        result *
        10 ** (getDenomInfo(pair?.denoms[0])!.significantFigures - getDenomInfo(pair?.denoms[1])!.significantFigures)
      );
    },
    {
      enabled,
      meta: {
        errorMessage: 'Error fetching price',
      },
    },
  );

  const pricePrecision = max([initialDenom?.pricePrecision || 0, resultingDenom?.pricePrecision || 0]);

  const formattedPrice = data
    ? data.toLocaleString('en-US', {
        maximumFractionDigits: pricePrecision || 3,
        minimumFractionDigits: 3,
      })
    : undefined;

  return {
    formattedPrice,
    price: data,
    ...helpers,
  };
}

export default function usePrice(
  resultingDenom: DenomInfo | undefined,
  initialDenom: DenomInfo | undefined,
  transactionType: TransactionType,
  enabled = true,
) {
  const { chain } = useChain();
  const config = useConfig();

  const client = useCosmWasmClient((state) => state.client);

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pair = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

  const isV3Enabled = !!client && !!pair && !!config && !!config?.exchange_contract_address && enabled;

  const isV2Enabled =
    !!client && !!pair && chain === Chains.Kujira && !!config && !config?.exchange_contract_address && enabled;

  const v3Price = usePriceV3(client, resultingDenom, initialDenom, pair as V3Pair, config, isV3Enabled);

  const kujiraPrice = usePriceKujira(
    client,
    resultingDenom,
    initialDenom,
    pair as V2Pair,
    transactionType,
    isV2Enabled,
  );

  const osmosisPrice = usePriceOsmosis(
    resultingDenom,
    initialDenom,
    transactionType,
    chain === Chains.Osmosis && !!config && !config?.exchange_contract_address && enabled,
  );

  return isV3Enabled ? v3Price : chain === Chains.Osmosis ? osmosisPrice : kujiraPrice;
}
