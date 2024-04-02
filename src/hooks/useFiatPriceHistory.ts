import 'isomorphic-fetch';
import * as Sentry from '@sentry/react';
import { COINGECKO_API_KEY, COINGECKO_ENDPOINT } from 'src/constants';
import { DenomInfo } from '@utils/DenomInfo';
import { useQuery } from '@tanstack/react-query';

export type FiatPriceHistoryResponse = {
  prices: number[][];
  total_volumes: number[][];
  market_caps: number[][];
};

const useFiatPriceHistory = (denom: DenomInfo, days: string) => {
  const { coingeckoId } = denom;
  const fiatCurrencyId = 'usd';

  return useQuery<FiatPriceHistoryResponse>(
    ['fiat-price-history', coingeckoId, fiatCurrencyId, days],
    async () => {
      const result = await fetch(
        `${COINGECKO_ENDPOINT}/coins/${coingeckoId}/market_chart?vs_currency=${fiatCurrencyId}&days=${days}&x_cg_pro_api_key=${COINGECKO_API_KEY}`,
      );

      if (!result.ok) {
        const error = await result.json();
        Sentry.captureException(error.error);
        throw new Error('Failed to fetch fiat price history');
      }

      return result.json();
    },
    {
      staleTime: 1000 * 60 * 10,
      retry: false,
      meta: {
        errorMessage: 'Error fetching fiat price history',
      },
    },
  );
};

export default useFiatPriceHistory;
