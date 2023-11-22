import { DenomInfo } from '@utils/DenomInfo';
import useFiatPrices from './useFiatPrices';

export type FiatPriceResponse = {
  [key: string]: {
    [key: string]: number;
  };
};

const FIAT_CURRENCY_ID = 'usd';
const PRICE_CHANGE_KEY = 'usd_24h_change';

const useFiatPrice = (denom: DenomInfo | undefined) => {
  const { prices, ...other } = useFiatPrices();

  return {
    price: denom && prices?.[denom.coingeckoId]?.[FIAT_CURRENCY_ID],
    data: prices,
    priceChange24Hr: denom && prices?.[denom.coingeckoId]?.[PRICE_CHANGE_KEY],
    ...other,
  };
};

export default useFiatPrice;
