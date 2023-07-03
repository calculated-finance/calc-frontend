import 'isomorphic-fetch';
import * as Sentry from '@sentry/react';
import { COINGECKO_ENDPOINT } from 'src/constants';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';

// export type FiatPriceHistoryResponse = {
//   market_data: number[][];
//   current_price: number;
//   usd:number;
// };

const usePriceAtCreation = (denom: DenomInfo | undefined, dateCreated: number) => {
  const { coingeckoId } = denom || {};
  const fiatCurrencyId = 'usd';

  const timestamp = dateCreated / 1000000;
  const date = new Date(timestamp);
  const formatedDate = date
    .toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
    .replaceAll('/', '-');

  console.log(formatedDate);

  const { data } = useQuery(
    ['market_data', 'current_price', 'usd'],
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
  console.log(data?.market_data.current_price.usd);
  return data?.market_data.current_price.usd;
};

export default usePriceAtCreation;
