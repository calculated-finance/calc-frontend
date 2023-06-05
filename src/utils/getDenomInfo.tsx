import { Denom, MainnetDenoms, TestnetDenoms, TestnetDenomsOsmosis, MainnetDenomsOsmosis } from '@models/Denom';
import { Coin } from 'src/interfaces/v2/generated/response/get_vaults_by_address';
import { Chains, useChainStore } from '@hooks/useChain';
import { useAssetListStore } from '@hooks/useCachedAssetList';
import { isNil } from 'lodash';
import { isMainnet } from './isMainnet';

type DenomInfo = {
  name: string;
  icon?: string;
  conversion?: (value: number) => number;
  deconversion?: (value: number) => number;
  priceDeconversion?: (value: number | undefined | null) => number;
  priceConversion?: (value: number | undefined | null) => number;
  stakeable?: boolean;
  stable?: boolean;
  coingeckoId: string;
  stakeableAndSupported?: boolean;
  promotion?: JSX.Element;
  enabled?: boolean;
  minimumSwapAmount?: number;
  significantFigures: number;
  enabledInDcaPlus?: boolean;
  osmosisId?: string;
  pricePrecision?: number;
};

const defaultDenom = {
  name: '',
  icon: '',
  conversion: (value: number) => value / 1000000,
  deconversion: (value: number) => Math.round(value * 1000000),
  stakeable: true,
  stakeableAndSupported: false,
  stable: false,
  coingeckoId: '',
  promotion: undefined,
  enabled: true,
  minimumSwapAmount: 0.05,
  priceDeconversion: (value: number | undefined | null) => Number(value),
  priceConversion: (value: number | undefined | null) => Number(value),
  significantFigures: 6,
  enabledInDcaPlus: false,
  osmosisId: undefined,
  pricePrecision: 3,
};

export const mainnetDenoms: Record<MainnetDenoms, DenomInfo> = {
  [MainnetDenoms.ATOM]: {
    name: 'ATOM',
    icon: '/images/denoms/atom.svg',
    stakeable: true,
    coingeckoId: 'cosmos',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [MainnetDenoms.stATOM]: {
    name: 'stATOM',
    icon: '/images/denoms/statom.svg',
    stakeable: true,
    coingeckoId: 'stride-staked-atom',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [MainnetDenoms.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usk',

    significantFigures: 6,
  },
  [MainnetDenoms.Kuji]: {
    name: 'KUJI',
    icon: '/images/denoms/kuji.svg',
    coingeckoId: 'kujira',
    stakeableAndSupported: true,
    significantFigures: 6,
  },
  [MainnetDenoms.AXL]: {
    name: 'axlUSDC',
    icon: '/images/denoms/axl.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usd-coin',
    significantFigures: 6,
  },
  [MainnetDenoms.WETH]: {
    name: 'wETH',
    icon: '/images/denoms/weth.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'weth',
    conversion: (value: number) => value / 10 ** 18,
    deconversion: (value: number) => Math.round(value * 10 ** 18),
    significantFigures: 18,

    priceDeconversion: (value: number | undefined | null) => Number(value) * 10 ** 12,
    priceConversion: (value: number | undefined | null) => Number(value) / 10 ** 12,
    enabled: true,
    minimumSwapAmount: 0.05 / 1000,
    enabledInDcaPlus: true,
  },
  [MainnetDenoms.Stars]: {
    name: 'STARS',
    icon: '/images/denoms/stars.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'stargaze',
    enabled: true,
    significantFigures: 6,
  },
  [MainnetDenoms.SCRT]: {
    name: 'SCRT',
    icon: '/images/denoms/scrt.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'secret',
    enabled: true,
    significantFigures: 6,
  },
  [MainnetDenoms.LOCAL]: {
    name: 'LOCAL',
    icon: '/images/denoms/local.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'local-money',
    enabled: true,
    significantFigures: 6,
  },
  [MainnetDenoms.LUNA]: {
    name: 'LUNA',
    icon: '/images/denoms/luna.svg',
    stakeable: true,
    coingeckoId: 'terra-luna-2',
    enabled: true,
    significantFigures: 6,
  },
  [MainnetDenoms.WBNB]: {
    name: 'wBNB',
    icon: '/images/denoms/wbnb.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'binancecoin',
    enabled: true,
    conversion: (value: number) => value / 10 ** 18,
    deconversion: (value: number) => Math.round(value * 10 ** 18),
    priceDeconversion: (value: number | undefined | null) => Number(value) * 10 ** 12,
    priceConversion: (value: number | undefined | null) => Number(value) / 10 ** 12,
    minimumSwapAmount: 0.05 / 1000,
    significantFigures: 18,
    enabledInDcaPlus: true,
  },
  [MainnetDenoms.OSMO]: {
    name: 'OSMO',
    icon: '/images/denoms/osmo.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'osmosis',
    enabled: true,
    significantFigures: 6,
  },
  [MainnetDenoms.DOT]: {
    name: 'DOT',
    icon: '/images/denoms/dot.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'polkadot',
    enabled: true,
    conversion: (value: number) => value / 10 ** 10,
    deconversion: (value: number) => Math.round(value * 10 ** 10),
    priceDeconversion: (value: number | undefined | null) => Number(value) * 10 ** 4,
    priceConversion: (value: number | undefined | null) => Number(value) / 10 ** 4,
    minimumSwapAmount: 0.05 / 1000,
    significantFigures: 10,
    enabledInDcaPlus: true,
  },
  [MainnetDenoms.GPAXG]: {
    name: 'gPAXG',
    icon: '/images/denoms/gpaxg.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'pax-gold',
    enabled: true,
    conversion: (value: number) => value / 10 ** 18,
    deconversion: (value: number) => Math.round(value * 10 ** 18),
    priceDeconversion: (value: number | undefined | null) => Number(value) * 10 ** 12,
    priceConversion: (value: number | undefined | null) => Number(value) / 10 ** 12,
    significantFigures: 18,
    minimumSwapAmount: 0.05 / 1000,
  },
  [MainnetDenoms.MARS]: {
    name: 'MARS',
    icon: '/images/denoms/mars.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'mars-protocol-a7fcbcfb-fd61-4017-92f0-7ee9f9cc6da3',
    enabled: true,
    significantFigures: 6,
  },
  [MainnetDenoms.STRD]: {
    name: 'STRD',
    icon: '/images/denoms/strd.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'stride',
    enabled: true,
    significantFigures: 6,
  },
  [MainnetDenoms.JUNO]: {
    name: 'JUNO',
    icon: '/images/denoms/juno.png',
    stakeable: true,
    stable: false,
    coingeckoId: 'juno-network',
    enabled: true,
    significantFigures: 6,
  },
  [MainnetDenoms.wTAO]: {
    name: 'wTAO',
    icon: '/images/denoms/wtao.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'wrapped-tao',
    enabled: true,
    conversion: (value: number) => value / 10 ** 9,
    deconversion: (value: number) => Math.round(value * 10 ** 9),
    priceDeconversion: (value: number | undefined | null) => Number(value) * 10 ** 3,
    priceConversion: (value: number | undefined | null) => Number(value) / 10 ** 3,
    significantFigures: 9,
  },
  [MainnetDenoms.INJ]: {
    name: 'INJ',
    icon: '/images/denoms/injective.png',
    stakeable: true,
    stable: false,
    coingeckoId: 'injective-protocol',
    conversion: (value: number) => value / 10 ** 18,
    deconversion: (value: number) => Math.round(value * 10 ** 18),
    priceDeconversion: (value: number | undefined | null) => Number(value) * 10 ** 12,
    priceConversion: (value: number | undefined | null) => Number(value) / 10 ** 12,
    enabled: true,
    significantFigures: 18,
  },
  [MainnetDenoms.WHALE]: {
    name: 'WHALE',
    icon: '/images/denoms/whale.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'white-whale',
    enabled: true,
    significantFigures: 6,
  },
  [MainnetDenoms.ROAR]: {
    name: 'ROAR',
    icon: '/images/denoms/roar.svg',
    stakeable: true,
    coingeckoId: 'lion-dao',
    significantFigures: 6,
    enabledInDcaPlus: false,
    stable: false,
    pricePrecision: 10,
  },
  [MainnetDenoms.AKT]: {
    name: 'AKT',
    icon: '/images/denoms/akt.svg',
    stakeable: true,
    coingeckoId: 'akash-network',
    significantFigures: 6,
    enabledInDcaPlus: false,
    stable: false,
    pricePrecision: 3,
  },
  [MainnetDenoms.MNTA]: {
    name: 'MNTA',
    icon: '/images/denoms/mnta.png',
    stakeable: true,
    coingeckoId: 'mantadao',
    significantFigures: 6,
    enabledInDcaPlus: false,
    stable: false,
    pricePrecision: 4,
  },
  [MainnetDenoms.ARB]: {
    name: 'ARB',
    icon: '/images/denoms/arb.svg',
    stakeable: true,
    coingeckoId: 'arbitrum',
    conversion: (value: number) => value / 10 ** 18,
    deconversion: (value: number) => Math.round(value * 10 ** 18),
    significantFigures: 18,
    priceDeconversion: (value: number | undefined | null) => Number(value) * 10 ** 12,
    priceConversion: (value: number | undefined | null) => Number(value) / 10 ** 12,
    enabledInDcaPlus: false,
    stable: false,
    pricePrecision: 3,
  },
  [MainnetDenoms.CNTO]: {
    name: 'CNTO',
    icon: '/images/denoms/cnto.png',
    stakeable: true,
    coingeckoId: 'ciento-exchange',
    conversion: (value: number) => value / 10 ** 18,
    deconversion: (value: number) => Math.round(value * 10 ** 18),
    significantFigures: 18,
    priceDeconversion: (value: number | undefined | null) => Number(value) * 10 ** 12,
    priceConversion: (value: number | undefined | null) => Number(value) / 10 ** 12,
    enabledInDcaPlus: false,
    stable: false,
    pricePrecision: 3,
  },
};
export const mainnetDenomsOsmosis: Record<MainnetDenomsOsmosis, Partial<DenomInfo>> = {
  [MainnetDenomsOsmosis.AXL]: {
    coingeckoId: 'usd-coin',
    stable: true,
  },
  [MainnetDenomsOsmosis.AVAX]: {
    coingeckoId: 'avalanche-2',
  },
  [MainnetDenomsOsmosis.wBNB]: {
    coingeckoId: 'wbnb',
    enabledInDcaPlus: true,
  },
  [MainnetDenomsOsmosis.DAI]: {
    coingeckoId: 'dai',
    stable: true,
  },
  [MainnetDenomsOsmosis.DOT]: {
    coingeckoId: 'polkadot',
  },
  [MainnetDenomsOsmosis.wETH]: {
    enabledInDcaPlus: true,
    coingeckoId: 'weth',
  },
  [MainnetDenomsOsmosis.FTM]: {
    coingeckoId: 'wrapped-fantom',
  },
  [MainnetDenomsOsmosis.IST]: {
    coingeckoId: 'inter-stable-token',
    stable: true,
  },
  [MainnetDenomsOsmosis.USDT]: {
    stable: true,
  },
  [MainnetDenomsOsmosis.ATOM]: {
    enabledInDcaPlus: true,
  },
  [MainnetDenomsOsmosis.stATOM]: {
    enabledInDcaPlus: true,
  },
  [MainnetDenomsOsmosis.wBTC]: {
    enabledInDcaPlus: true,
    coingeckoId: 'wrapped-bitcoin',
  },
  [MainnetDenomsOsmosis.PSTAKE]: {
    coingeckoId: 'pstake-finance',
  },
  [MainnetDenomsOsmosis.PEPE]: {
    coingeckoId: 'pepe',
  },
  [MainnetDenomsOsmosis.MATIC]: {
    coingeckoId: 'matic-network',
  },
};

export const testnetDenoms: Record<TestnetDenoms, DenomInfo> = {
  [TestnetDenoms.Demo]: {
    name: 'DEMO',
    stable: true,
    coingeckoId: 'usd-coin',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usk',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.Kuji]: {
    name: 'KUJI',
    icon: '/images/denoms/kuji.svg',
    coingeckoId: 'kujira',
    stakeableAndSupported: true,
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.AXL]: {
    name: 'axlUSDC',
    icon: '/images/denoms/axl.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usd-coin',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.LUNA]: {
    name: 'LUNA',
    icon: '/images/denoms/luna.svg',
    coingeckoId: 'terra-luna',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.OSMO]: {
    name: 'OSMO',
    icon: '/images/denoms/osmo.svg',
    coingeckoId: 'osmosis',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.NBTC]: {
    name: 'NBTC',
    stakeable: false,
    coingeckoId: 'bitcoin',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  // [TestnetDenomsOsmosis.OSMO]: {
  //   name: 'OSMO',
  //   icon: '/images/denoms/osmo.svg',
  //   stakeable: true,
  //   stakeableAndSupported: true,
  //   coingeckoId: 'osmosis',
  //   significantFigures: 6,
  //   osmosisId: 'OSMO',
  //   enabledInDcaPlus: true,
  // },
  // [TestnetDenomsOsmosis.AXL]: {
  //   name: 'axlUSDC',
  //   icon: '/images/denoms/axl.svg',
  //   stakeable: false,
  //   stable: true,
  //   coingeckoId: 'usd-coin',
  //   significantFigures: 6,
  //   osmosisId: 'aUSDC',
  //   enabledInDcaPlus: true,
  // },
  // [TestnetDenomsOsmosis.ATOM]: {
  //   name: 'ATOM',
  //   icon: '/images/denoms/atom.svg',
  //   osmosisId: 'ATOM',
  //   stakeable: true,
  //   coingeckoId: 'cosmos',
  //   significantFigures: 6,
  //   enabledInDcaPlus: true,
  // },
  // [TestnetDenomsOsmosis.ION]: {
  //   name: 'ION',
  //   icon: '/images/denoms/ion.svg',
  //   osmosisId: 'ION',
  //   stakeable: true,
  //   coingeckoId: 'ion',
  //   significantFigures: 6,
  //   enabledInDcaPlus: true,
  // },
};

const stableDenomsTestnet = [TestnetDenomsOsmosis.AXL.toString()];

function isDenomInStablesList(denom: Denom) {
  if (isMainnet()) {
    return mainnetDenomsOsmosis[denom as MainnetDenomsOsmosis]?.stable;
  }
  return stableDenomsTestnet.includes(denom);
}

const getDenomInfo = (denom?: string, injectedChain?: Chains) => {
  // if osmosis blah adapter to current properties
  // use zustand to get chain id
  // use chain store?   const { chain } = useChainStore.getState(); do this if iyt works
  // test with 3g
  const { chain: storedChain } = useChainStore.getState();

  const chain = injectedChain || storedChain;

  const { assetList } = useAssetListStore.getState();

  if (chain === Chains.Osmosis && assetList?.assets) {
    // map asset list to denom info
    const asset = assetList.assets.find((a) => a.base === denom);

    if (!asset) {
      return defaultDenom;
    }

    const mapTo = {} as Partial<DenomInfo>;

    mapTo.name = asset.symbol;
    mapTo.icon = asset.logo_URIs?.svg || asset.logo_URIs?.png;
    mapTo.stakeable = !isDenomInStablesList(denom as Denom);
    mapTo.stable = isDenomInStablesList(denom as Denom);
    mapTo.coingeckoId = asset.coingecko_id || mainnetDenomsOsmosis[denom as MainnetDenomsOsmosis]?.coingeckoId || '';
    mapTo.osmosisId = asset.symbol;
    mapTo.enabledInDcaPlus = isMainnet() ? mainnetDenomsOsmosis[denom as MainnetDenomsOsmosis]?.enabledInDcaPlus : true;

    const findDenomUnits = asset.denom_units.find((du) => du.denom === asset.display);
    const significantFigures = findDenomUnits?.exponent || 6;

    mapTo.significantFigures = significantFigures;
    mapTo.pricePrecision = 6;
    mapTo.stakeableAndSupported = denom === 'uosmo';

    if (!isNil(significantFigures) && significantFigures !== 6) {
      mapTo.conversion = (value: number) => value / 10 ** significantFigures;
      mapTo.deconversion = (value: number) => Math.round(value * 10 ** significantFigures);
      mapTo.priceDeconversion = (value: number | null | undefined) => Number(value) * 10 ** (significantFigures - 6);
      mapTo.priceConversion = (value: number | null | undefined) => Number(value) / 10 ** (significantFigures - 6);
      mapTo.minimumSwapAmount = 0.05 / 1000;
    }

    if (isMainnet()) {
      return {
        ...defaultDenom,
        ...mainnetDenomsOsmosis[denom as MainnetDenomsOsmosis],
        ...mapTo,
      };
    }
    return {
      ...defaultDenom,
      ...testnetDenoms[denom as TestnetDenoms],
      ...mapTo,
    };
  }
  // second comparison is not needed but just being explicit
  if (isMainnet() && chain === Chains.Kujira) {
    return {
      ...defaultDenom,
      ...mainnetDenoms[denom as MainnetDenoms],
    };
  }
  return {
    ...defaultDenom,
    ...testnetDenoms[denom as TestnetDenoms],
  };
};

export function getDenomName(denom: string) {
  return getDenomInfo(denom).name;
}

export function convertDenomFromCoin(coin: Coin | undefined) {
  if (!coin) {
    return 0;
  }
  const { significantFigures, conversion } = getDenomInfo(coin.denom);
  return Number(conversion(Number(coin.amount)).toFixed(significantFigures));
}

export function getDenomMinimumSwapAmount(denom: string) {
  return getDenomInfo(denom).minimumSwapAmount;
}

export class DenomValue {
  readonly denomId: Denom;

  readonly amount: number;

  constructor(denomAmount: Coin) {
    // make this not option and handle code when loading
    this.denomId = denomAmount?.denom || '';
    this.amount = Number(denomAmount?.amount || 0);
  }

  toConverted() {
    const { conversion } = getDenomInfo(this.denomId);
    return parseFloat(conversion(this.amount).toFixed(6));
  }
}

export function isDenomStable(denom: Denom) {
  return getDenomInfo(denom).stable;
}
export function isDenomVolatile(denom: Denom) {
  return !isDenomStable(denom);
}

export default getDenomInfo;
