import { Denom } from '@models/Denom';
import getDenomInfo from '@utils/getDenomInfo';
import 'isomorphic-fetch';
import { COINGECKO_ENDPOINT } from 'src/constants';
import useQueryWithNotification from './useQueryWithNotification';

export type FiatPriceHistoryResponse = {
  prices: number[][];
  total_volumes: number[][];
  market_caps: number[][];
};

const useFiatPriceHistory = (denom: Denom | undefined, days: string) => {
  const { coingeckoId } = getDenomInfo(denom);
  const fiatCurrencyId = 'usd';

  return useQueryWithNotification<FiatPriceHistoryResponse>(
    ['fiat-price-history', coingeckoId, fiatCurrencyId, days],
    async () => {
      const url = `${COINGECKO_ENDPOINT}/coins/${coingeckoId}/market_chart?vs_currency=${fiatCurrencyId}&days=${days}`;
      console.log(url);
      const result = await fetch(url);
      if (!result.ok) {
        throw new Error('Failed to fetch fiat price history');
      }
      return result.json();
    },
    {
      enabled: !!coingeckoId && !!fiatCurrencyId && !!days,
    },
  );
};

export default useFiatPriceHistory;
