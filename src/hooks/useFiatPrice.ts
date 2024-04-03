import { DenomInfo } from '@utils/DenomInfo';
import useFiatPrices from '@hooks/useFiatPrices';

export type FiatPriceResponse = {
  [key: string]: {
    [key: string]: number;
  };
};

const FIAT_CURRENCY_ID = 'usd';
const PRICE_CHANGE_KEY = 'usd_24h_change';

const useFiatPrice = (denom: DenomInfo | undefined) => {
  const { fiatPrices, ...other } = useFiatPrices();

  return {
    fiatPrice: denom && denom.coingeckoId ? fiatPrices?.[denom.coingeckoId]?.[FIAT_CURRENCY_ID] : undefined,
    priceChange24Hr: denom && denom.coingeckoId ? fiatPrices?.[denom.coingeckoId]?.[PRICE_CHANGE_KEY] : undefined,
    ...other,
  };
};

export default useFiatPrice;
