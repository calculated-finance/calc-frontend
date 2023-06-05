import { Denom } from '@models/Denom';
import getDenomInfo from '@utils/getDenomInfo';
import * as Sentry from '@sentry/react';
import 'isomorphic-fetch';
import { COINGECKO_ENDPOINT } from 'src/constants';
import { useQuery } from '@tanstack/react-query';
import { useSupportedDenoms } from './useSupportedDenoms';
import { Chains, useChain } from './useChain';

export type FiatPriceResponse = any;

const useFiatPrice = (denom: Denom | undefined, injectedSupportedDenoms: Denom[] | undefined = undefined) => {
  const { coingeckoId } = getDenomInfo(denom, injectedSupportedDenoms ? Chains.Kujira : undefined);
  const fiatCurrencyId = 'usd';
  const priceChange = 'usd_24h_change';

  const { chain } = useChain();

  const fetchedSupportedDenoms = useSupportedDenoms();

  const supportedDenoms = injectedSupportedDenoms ?? fetchedSupportedDenoms;

  const { data, ...other } = useQuery<FiatPriceResponse>(
    ['fiat-price', chain, supportedDenoms],
    async () => {
      const url = `${COINGECKO_ENDPOINT}/simple/price?ids=${supportedDenoms
        .map((denomId: Denom) => getDenomInfo(denomId, injectedSupportedDenoms ? Chains.Kujira : undefined).coingeckoId)
        .join(',')}&vs_currencies=${fiatCurrencyId}&include_24hr_change=true`;

      const response = await fetch(url);
      if (!response.ok) {
        const error = await response.json();
        Sentry.captureException(error.error);
        throw new Error('Failed to fetch fiat price');
      }

      return response.json();
    },
    {
      cacheTime: 5000,
      staleTime: 30000,
      enabled: !!coingeckoId && !!fiatCurrencyId && !!chain && Boolean(supportedDenoms.length),
      meta: {
        errorMessage: 'Error fetching fiat price',
      },
    },
  );

  return {
    price: data?.[coingeckoId]?.[fiatCurrencyId],
    data,
    priceChange24Hr: data?.[coingeckoId]?.[priceChange],
    ...other,
  };
};

export default useFiatPrice;
