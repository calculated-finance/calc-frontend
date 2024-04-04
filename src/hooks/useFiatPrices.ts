import * as Sentry from '@sentry/react';
import 'isomorphic-fetch';
import { COINGECKO_API_KEY, COINGECKO_ENDPOINT } from 'src/constants';
import { values } from 'rambda';
import useDenoms from '@hooks/useDenoms';
import { useQuery } from '@tanstack/react-query';

export type FiatPriceResponse = {
  [key: string]: {
    [key: string]: number;
  };
};

const FIAT_CURRENCY_ID = 'usd';

const useFiatPrices = () => {
  const { allDenoms } = useDenoms();
  const denomsList = values(allDenoms ?? {});

  const { data: fiatPrices, ...other } = useQuery<FiatPriceResponse>(
    ['fiat-prices', denomsList.length],
    async () => {
      const coingeckoIds = denomsList.map((denom: any) => denom.coingeckoId);
      const formattedIds = coingeckoIds.join(',');
      const url = `${COINGECKO_ENDPOINT}/simple/price?ids=${formattedIds}&vs_currencies=${FIAT_CURRENCY_ID}&include_24hr_change=true&x_cg_pro_api_key=${COINGECKO_API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error('Failed to fetch fiat prices');
      }

      return response.json();
    },
    {
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      enabled: !!denomsList,
      retry: false,
      meta: {
        errorMessage: 'Error fetching fiat prices',
      },
    },
  );

  return {
    fiatPrices,
    ...other,
  };
};

export default useFiatPrices;
