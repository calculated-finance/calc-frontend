import { Denom } from '@models/Denom';
import getDenomInfo from '@utils/getDenomInfo';
import 'isomorphic-fetch';
import { COINGECKO_ENDPOINT } from 'src/constants';
import useQueryWithNotification from './useQueryWithNotification';

export type FiatPriceResponse = any;

const useFiatPrice = (denom: Denom | undefined) => {
  const { coingeckoId } = getDenomInfo(denom);
  const fiatCurrencyId = 'usd';

  const { data, ...other } = useQueryWithNotification<FiatPriceResponse>(
    ['fiat-price', coingeckoId, fiatCurrencyId],
    async () => {
      const response = await fetch(
        `${COINGECKO_ENDPOINT}/simple/price?ids=${coingeckoId}&vs_currencies=${fiatCurrencyId}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch fiat price');
      }

      return response.json();
    },
    {
      enabled: !!coingeckoId && !!fiatCurrencyId,
    },
  );

  return {
    price: data?.[coingeckoId]?.[fiatCurrencyId],
    data,
    ...other,
  };
};

export default useFiatPrice;
