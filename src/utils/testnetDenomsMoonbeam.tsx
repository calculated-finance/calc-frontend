import {  TestnetDenomsMoonbeam } from '@models/Denom';
import { DenomInfo } from './DenomInfo';


export const testnetDenomsMoonbeam: Record<TestnetDenomsMoonbeam, Partial<DenomInfo>> = {
  [TestnetDenomsMoonbeam.WDEV]: {

    name: 'WDEV',
    icon: '/images/denoms/weth.svg',
    stable: true,
    coingeckoId: 'usd-coin',
    significantFigures: 18,
    enabledInDcaPlus: true,
  },
  [TestnetDenomsMoonbeam.SATURN]: {
    name: 'SAT',
    icon: '/images/denoms/moonbeam/saturn.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'usk',
    significantFigures: 18,
    enabledInDcaPlus: true,
  },

};
