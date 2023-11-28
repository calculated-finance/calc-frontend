import * as Sentry from '@sentry/react';
import 'isomorphic-fetch';
import { COINGECKO_ENDPOINT } from 'src/constants';
import { useQuery } from '@tanstack/react-query';
import { reduce } from 'rambda';
import { useSupportedDenoms } from './useSupportedDenoms';

export type FiatPriceResponse = {
  [key: string]: {
    [key: string]: number;
  };
};

const FIAT_CURRENCY_ID = 'usd';

const useFiatPrices = () => {
  const supportedDenoms = useSupportedDenoms();

  const { data, ...other } = useQuery<FiatPriceResponse>(
    ['fiat-prices'],
    async () => {
      const coingeckoIds = supportedDenoms.map((supportedDenom) => supportedDenom.coingeckoId);

      if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
        return reduce(
          (acc: Record<string, any>, id: string) => ({
            ...acc,
            [id]: { usd: Math.random(), usd_24h_change: Math.random() },
          }),
          {},
          coingeckoIds,
        );
      }

      const formattedIds = coingeckoIds.join(',');
      const url = `${COINGECKO_ENDPOINT}/simple/price?ids=${formattedIds}&vs_currencies=${FIAT_CURRENCY_ID}&include_24hr_change=true`;
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        Sentry.captureException(error.error);
        throw new Error('Failed to fetch fiat prices');
      }

      return response.json();
    },
    {
      cacheTime: 5000,
      staleTime: 30000,
      enabled: Boolean(supportedDenoms.length),
      meta: {
        errorMessage: 'Error fetching fiat prices',
      },
    },
  );

  return {
    prices: data,
    ...other,
  };
};

export default useFiatPrices;
