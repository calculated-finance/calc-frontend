import 'isomorphic-fetch';
import * as Sentry from '@sentry/react';
import { COINGECKO_API_KEY, COINGECKO_ENDPOINT } from 'src/constants';
import { DenomInfo } from '@utils/DenomInfo';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

export type FiatPriceHistoryResponse = {
  prices: number[][];
  total_volumes: number[][];
  market_caps: number[][];
};

const useFiatPriceHistory = (denom: DenomInfo | undefined, days: string) => {
  const { coingeckoId } = denom || {};
  const fiatCurrencyId = 'usd';

  return useQuery<FiatPriceHistoryResponse>(
    ['fiat-price-history', coingeckoId, fiatCurrencyId, days],
    async () => {
      if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
        let i = 10;
        const price = Math.random();
        return {
          prices: Array.from({ length: 100 }, () => {
            i += 1;
            return [dayjs().subtract(i, 'minutes').toDate().getTime(), price + i / 50];
          }),
        };
      }

      const result = await fetch(
        `${COINGECKO_ENDPOINT}/coins/${coingeckoId}/market_chart?vs_currency=${fiatCurrencyId}&days=${days}`, // &x_cg_demo_api_key=${COINGECKO_API_KEY}`,
      );

      if (!result.ok) {
        const error = await result.json();
        Sentry.captureException(error.error);
        throw new Error('Failed to fetch fiat price history');
      }

      return result.json();
    },
    {
      enabled: !!coingeckoId && !!fiatCurrencyId && !!days,
      staleTime: 1000 * 60 * 10,
      retry: false,
      meta: {
        errorMessage: 'Error fetching fiat price history',
      },
    },
  );
};

export default useFiatPriceHistory;
