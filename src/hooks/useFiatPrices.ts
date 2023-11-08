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

const useFiatPrices = (injectedSupportedDenoms?: DenomInfo[]) => {
  const { chain } = useChain();

  const fetchedSupportedDenoms = useSupportedDenoms();

  const fiatCurrencyId = 'usd';

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
        throw new Error('Failed to fetch fiat prices');
      }

      return response.json();
    },
    {
      cacheTime: 5000,
      staleTime: 30000,
      enabled: !!chain && Boolean(supportedDenoms.length),
      meta: {
        errorMessage: 'Error fetching fiat prices',
      },
    },
  );

  console.log('prices', data);

  return {
    prices: data,
    ...other,
  };
};

export default useFiatPrices;
