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

const useValueAtCreation = (denom: DenomInfo | undefined, dateCreated: number) => {
  const { coingeckoId } = denom || {};
  const fiatCurrencyId = 'usd';

  const timestamp = dateCreated / 1000000; // Divide by 1 million to convert nanoseconds to milliseconds
  const date = new Date(timestamp);
  const formatedDate = date
    .toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
    .replaceAll('/', '-');

  console.log(formatedDate);

  return useQuery<FiatPriceHistoryResponse>(
    ['fiat-price-history', coingeckoId, fiatCurrencyId, dateCreated],
    async () => {
      const result = await fetch(`${COINGECKO_ENDPOINT}/coins/${coingeckoId}/history?date=${formatedDate}`);
      if (!result.ok) {
        const error = await result.json();
        Sentry.captureException(error.error);

        throw new Error('Failed to fetch fiat value at creation');
      }
      return result.json();
    },
    {
      enabled: !!coingeckoId && !!fiatCurrencyId && !!dateCreated,
      meta: {
        errorMessage: 'Error fetching fiat price history',
      },
    },
  );
};

export default useValueAtCreation;
