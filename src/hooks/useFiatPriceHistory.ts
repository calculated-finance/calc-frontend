import { Denom } from '@models/Denom';
import getDenomInfo from '@utils/getDenomInfo';
import 'isomorphic-fetch';
import * as Sentry from '@sentry/react';
import { COINGECKO_ENDPOINT } from 'src/constants';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';

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
      const result = await fetch(
        `${COINGECKO_ENDPOINT}/coins/${coingeckoId}/market_chart?vs_currency=${fiatCurrencyId}&days=${days}`,
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
      meta: {
        errorMessage: 'Error fetching fiat price history',
      },
    },
  );
};

export default useFiatPriceHistory;
