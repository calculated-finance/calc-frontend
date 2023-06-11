import * as Sentry from '@sentry/react';
import 'isomorphic-fetch';
import { COINGECKO_ENDPOINT } from 'src/constants';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { useSupportedDenoms } from './useSupportedDenoms';
import { useChain } from './useChain';

export type FiatPriceResponse = {
  [key: string]: {
    [key: string]: number;
  };
};

const useFiatPrice = (denom: DenomInfo | undefined, injectedSupportedDenoms?: DenomInfo[]) => {
  const { chain } = useChain();

  const fetchedSupportedDenoms = useSupportedDenoms();

  const fiatCurrencyId = 'usd';
  const priceChange = 'usd_24h_change';

  const supportedDenoms = injectedSupportedDenoms ?? fetchedSupportedDenoms;

  const { data, ...other } = useQuery<FiatPriceResponse>(
    ['fiat-price', chain, supportedDenoms],
    async () => {
      const coingeckoIds = supportedDenoms.map((supportedDenom) => supportedDenom.coingeckoId);
      const formattedIds = coingeckoIds.join(',');
      const url = `${COINGECKO_ENDPOINT}/simple/price?ids=${formattedIds}&vs_currencies=${fiatCurrencyId}&include_24hr_change=true`;

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
      enabled: !!denom?.coingeckoId && !!fiatCurrencyId && !!chain && Boolean(supportedDenoms.length),
      meta: {
        errorMessage: 'Error fetching fiat price',
      },
    },
  );

  return {
    price: denom && data?.[denom.coingeckoId]?.[fiatCurrencyId],
    data,
    priceChange24Hr: denom && data?.[denom.coingeckoId]?.[priceChange],
    ...other,
  };
};

export default useFiatPrice;
