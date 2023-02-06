import { TransactionType } from '@components/TransactionType';
import { Denom, Denoms } from '@models/Denom';
import getDenomInfo from '@utils/getDenomInfo';
import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import 'isomorphic-fetch';
import { COINGECKO_ENDPOINT } from 'src/constants';
import usePrice from './usePrice';
import useQueryWithNotification from './useQueryWithNotification';

export type FiatPriceResponse = any;

const useFiatPrice = (denom: Denom | undefined) => {
  const { coingeckoId, finPriceDenom } = getDenomInfo(denom);
  const fiatCurrencyId = 'usd';

  const { data, ...other } = useQueryWithNotification<FiatPriceResponse>(
    ['fiat-price'],
    async () => {
      const url = `${COINGECKO_ENDPOINT}/simple/price?ids=${SUPPORTED_DENOMS.map(
        (denomId: Denom) => getDenomInfo(denomId).coingeckoId,
      ).join(',')}&vs_currencies=${fiatCurrencyId}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch fiat price');
      }

      return response.json();
    },
    {
      cacheTime: 5000,
      enabled: !!coingeckoId && !!fiatCurrencyId,
    },
  );

  const { rawPrice } = usePrice(denom, finPriceDenom, TransactionType.Buy, !!finPriceDenom);
  console.log('denom', denom);
  console.log('fin price', rawPrice);
  console.log('coingecko price', data?.[coingeckoId]?.[fiatCurrencyId]);

  return {
    price: rawPrice || data?.[coingeckoId]?.[fiatCurrencyId],
    pricedUsingFin: !!finPriceDenom,
    data,
    ...other,
  };
};

export default useFiatPrice;
