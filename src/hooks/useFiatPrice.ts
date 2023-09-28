import 'isomorphic-fetch';
import { DenomInfo } from '@utils/DenomInfo';
import { useSupportedDenoms } from './useSupportedDenoms';
import useFiatPrices from './useFiatPrices';

export type FiatPriceResponse = {
  [key: string]: {
    [key: string]: number;
  };
};

const useFiatPrice = (denom: DenomInfo | undefined, injectedSupportedDenoms?: DenomInfo[]) => {
  const fetchedSupportedDenoms = useSupportedDenoms();

  const fiatCurrencyId = 'usd';
  const priceChange = 'usd_24h_change';

  const supportedDenoms = injectedSupportedDenoms ?? fetchedSupportedDenoms;

  const { prices, ...other } = useFiatPrices(supportedDenoms);

  return {
    price: denom && prices?.[denom.coingeckoId]?.[fiatCurrencyId],
    data: prices,
    priceChange24Hr: denom && prices?.[denom.coingeckoId]?.[priceChange],
    ...other,
  };
};

export default useFiatPrice;
