import { Denoms } from '@models/Denom';
import getDenomInfo from '@utils/getDenomInfo';
import 'isomorphic-fetch';
import { COINGECKO_ENDPOINT } from 'src/constants';
import useQueryWithNotification from './useQueryWithNotification';

export type Validator = {
  operator_address: string;
  description: {
    moniker: string;
  };
  jailed: boolean;
};

export type PriceResponse = any;

const useFiatPrice = (denom: Denoms) => {
  const { coingeckoId } = getDenomInfo(denom);
  const fiatCurrencyId = 'usd';

  const { data, ...other } = useQueryWithNotification<PriceResponse>(
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
      enabled: !!coingeckoId,
    },
  );

  return {
    price: data?.[coingeckoId]?.[fiatCurrencyId],
    data,
    ...other,
  };
};

export default useFiatPrice;
