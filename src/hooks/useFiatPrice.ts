import { Denom } from '@models/Denom';
import getDenomInfo from '@utils/getDenomInfo';
import 'isomorphic-fetch';
import { COINGECKO_ENDPOINT } from 'src/constants';
import useQueryWithNotification from './useQueryWithNotification';
import { Chains, useChain } from './useChain';
import { useSupportedDenoms } from './useSupportedDenoms';

export type FiatPriceResponse = any;

const useFiatPrice = (denom: Denom | undefined) => {
  const { coingeckoId } = getDenomInfo(denom);
  const fiatCurrencyId = 'usd';
  const priceChange = 'usd_24h_change';

  const { chain } = useChain();

  const supportedDenoms = useSupportedDenoms();

  const { data, ...other } = useQueryWithNotification<FiatPriceResponse>(
    ['fiat-price', chain, supportedDenoms],
    async () => {
      const url = `${COINGECKO_ENDPOINT}/simple/price?ids=${supportedDenoms
        .map((denomId: Denom) => getDenomInfo(denomId).coingeckoId)
        .join(',')}&vs_currencies=${fiatCurrencyId}&include_24hr_change=true`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch fiat price');
      }

      return response.json();
    },
    {
      cacheTime: 5000,
      staleTime: 30000,
      enabled: !!coingeckoId && !!fiatCurrencyId && !!chain && !!supportedDenoms,
    },
  );

  return {
    price: data?.[coingeckoId]?.[fiatCurrencyId],
    data,
    priceChange24Hr: data?.[coingeckoId]?.[priceChange],
    ...other,
  };
};

export default useFiatPrice;
