import { ChainId } from '@models/ChainId';
import {
  ArchwayTestnetDenoms,
  KujiraMainnetDenoms,
  KujiraTestnetDenoms,
  OsmosisMainnetDenoms,
  OsmosisTestnetDenoms,
} from '@models/Denom';
import { DenomInfo } from './DenomInfo';

export const DENOMS: Record<ChainId, Record<string, Partial<DenomInfo>>> = {
  'kaiyo-1': {
    [KujiraMainnetDenoms.ATOM]: {
      name: 'ATOM',
      icon: '/images/denoms/atom.svg',
      stakeable: true,
      coingeckoId: 'cosmos',
      enabledInDcaPlus: true,
    },
    [KujiraMainnetDenoms.stATOM]: {
      name: 'stATOM',
      icon: '/images/denoms/statom.svg',
      stakeable: true,
      coingeckoId: 'stride-staked-atom',
      enabledInDcaPlus: true,
    },
    [KujiraMainnetDenoms.USK]: {
      name: 'USK',
      icon: '/images/denoms/usk.svg',
      stable: true,
      coingeckoId: 'usk',
    },
    [KujiraMainnetDenoms.Kuji]: {
      name: 'KUJI',
      icon: '/images/denoms/kuji.svg',
      coingeckoId: 'kujira',
      stakeable: true,
      stakeableAndSupported: true,
    },
    [KujiraMainnetDenoms.axlUSDC]: {
      name: 'axlUSDC',
      icon: '/images/denoms/usdc.svg',
      stable: true,
      coingeckoId: 'usd-coin',
    },
    [KujiraMainnetDenoms.WETH]: {
      name: 'wETH',
      icon: '/images/denoms/weth.svg',
      stakeable: true,
      coingeckoId: 'weth',
      significantFigures: 18,
      minimumSwapAmount: 0.05 / 1000,
      enabledInDcaPlus: true,
    },
    [KujiraMainnetDenoms.Stars]: {
      name: 'STARS',
      icon: '/images/denoms/stars.svg',
      stakeable: true,
      coingeckoId: 'stargaze',
    },
    [KujiraMainnetDenoms.SCRT]: {
      name: 'SCRT',
      icon: '/images/denoms/scrt.svg',
      stakeable: true,
      coingeckoId: 'secret',
      enabled: true,
    },
    [KujiraMainnetDenoms.LOCAL]: {
      name: 'LOCAL',
      icon: '/images/denoms/local.svg',
      stakeable: true,

      coingeckoId: 'local-money',
    },
    [KujiraMainnetDenoms.LUNA]: {
      name: 'LUNA',
      icon: '/images/denoms/luna.svg',
      stakeable: true,
      coingeckoId: 'terra-luna-2',
      enabled: true,
    },
    [KujiraMainnetDenoms.WBNB]: {
      name: 'wBNB',
      icon: '/images/denoms/wbnb.svg',
      stakeable: true,
      coingeckoId: 'binancecoin',
      minimumSwapAmount: 0.05 / 1000,
      significantFigures: 18,
      enabledInDcaPlus: true,
    },
    [KujiraMainnetDenoms.OSMO]: {
      name: 'OSMO',
      icon: '/images/denoms/osmo.svg',
      stakeable: true,
      coingeckoId: 'osmosis',
    },
    [KujiraMainnetDenoms.DOT]: {
      name: 'DOT',
      icon: '/images/denoms/dot.svg',
      stakeable: true,
      coingeckoId: 'polkadot',
      minimumSwapAmount: 0.05 / 1000,
      significantFigures: 10,
      enabledInDcaPlus: true,
    },
    [KujiraMainnetDenoms.GPAXG]: {
      name: 'gPAXG',
      icon: '/images/denoms/gpaxg.svg',
      stakeable: true,
      coingeckoId: 'pax-gold',
      significantFigures: 18,
      minimumSwapAmount: 0.05 / 1000,
    },
    [KujiraMainnetDenoms.MARS]: {
      name: 'MARS',
      icon: '/images/denoms/mars.svg',
      stakeable: true,
      coingeckoId: 'mars-protocol-a7fcbcfb-fd61-4017-92f0-7ee9f9cc6da3',
    },
    [KujiraMainnetDenoms.STRD]: {
      name: 'STRD',
      icon: '/images/denoms/strd.svg',
      stakeable: true,
      coingeckoId: 'stride',
    },
    [KujiraMainnetDenoms.JUNO]: {
      name: 'JUNO',
      icon: '/images/denoms/juno.png',
      stakeable: true,
      coingeckoId: 'juno-network',
    },
    [KujiraMainnetDenoms.wTAO]: {
      name: 'wTAO',
      icon: '/images/denoms/wtao.svg',
      stakeable: true,
      coingeckoId: 'wrapped-tao',
      significantFigures: 9,
    },
    [KujiraMainnetDenoms.INJ]: {
      name: 'INJ',
      icon: '/images/denoms/injective.png',
      stakeable: true,
      coingeckoId: 'injective-protocol',
      significantFigures: 18,
    },
    [KujiraMainnetDenoms.WHALE]: {
      name: 'WHALE',
      icon: '/images/denoms/whale.svg',
      stakeable: true,
      coingeckoId: 'white-whale',
    },
    [KujiraMainnetDenoms.ROAR]: {
      name: 'ROAR',
      icon: '/images/denoms/roar.svg',
      stakeable: true,
      coingeckoId: 'lion-dao',
      pricePrecision: 10,
    },
    [KujiraMainnetDenoms.AKT]: {
      name: 'AKT',
      icon: '/images/denoms/akt.svg',
      stakeable: true,
      coingeckoId: 'akash-network',
    },
    [KujiraMainnetDenoms.MNTA]: {
      name: 'MNTA',
      icon: '/images/denoms/mnta.png',
      stakeable: true,
      coingeckoId: 'mantadao',
      pricePrecision: 4,
    },
    [KujiraMainnetDenoms.ARB]: {
      name: 'ARB',
      icon: '/images/denoms/arb.svg',
      stakeable: true,
      coingeckoId: 'arbitrum',
      significantFigures: 18,
    },
    [KujiraMainnetDenoms.CNTO]: {
      name: 'CNTO',
      icon: '/images/denoms/cnto.png',
      stakeable: true,
      coingeckoId: 'ciento-exchange',
      significantFigures: 18,
    },
    [KujiraMainnetDenoms.ARCH]: {
      name: 'ARCH',
      icon: '/images/denoms/archway.svg',
      coingeckoId: 'archway',
      significantFigures: 18,
      pricePrecision: 4,
    },
    [KujiraMainnetDenoms.USDC]: {
      name: 'USDC',
      icon: '/images/denoms/usdc.svg',
      coingeckoId: 'usd-coin',
      stable: true,
    },
    [KujiraMainnetDenoms.wBTC]: {
      name: 'wBTC',
      icon: '/images/denoms/wbtc.png',
      coingeckoId: 'wrapped-bitcoin',
      significantFigures: 8,
      minimumSwapAmount: 0.05 / 10000,
    },
    [KujiraMainnetDenoms.WINK]: {
      name: 'WINK',
      icon: '/images/denoms/wink.png',
      coingeckoId: 'winkhub',
    },
    [KujiraMainnetDenoms.wstETH]: {
      name: 'wstETH',
      icon: '/images/denoms/wsteth.svg',
      coingeckoId: 'wrapped-steth',
      significantFigures: 18,
      pricePrecision: 2,
    },
    [KujiraMainnetDenoms.yieldETH]: {
      name: 'yieldETH',
      icon: '/images/denoms/yieldeth.svg',
      coingeckoId: 'yieldeth-sommelier',
      significantFigures: 18,
    },
    [KujiraMainnetDenoms.TIA]: {
      name: 'TIA',
      icon: '/images/denoms/tia.svg',
      coingeckoId: 'celestia',
    },
    [KujiraMainnetDenoms.FUZN]: {
      name: 'FUZN',
      icon: '/images/denoms/fuzn.svg',
      coingeckoId: 'fuzion',
    },
    [KujiraMainnetDenoms.nBTC]: {
      name: 'nBTC',
      icon: '/images/denoms/nbtc.svg',
      coingeckoId: 'bitcoin',
      enabledInDcaPlus: true,
      significantFigures: 14,
      minimumSwapAmount: 0.05 / 10000,
    },
    [KujiraMainnetDenoms.NSTK]: {
      name: 'NSTK',
      icon: '/images/denoms/nstk.svg',
      coingeckoId: 'unstake-fi',
    },
    [KujiraMainnetDenoms.PLNK]: {
      name: 'PLNK',
      icon: '/images/denoms/plnk.png',
      coingeckoId: 'plankton',
    },
    [KujiraMainnetDenoms.DYDX]: {
      name: 'DYDX',
      icon: '/images/denoms/dydx.png',
      coingeckoId: 'dydx-chain',
      significantFigures: 18,
    },
    [KujiraMainnetDenoms.ASTRO]: {
      name: 'ASTRO',
      icon: '/images/denoms/astro.png',
      coingeckoId: 'astroport-fi',
    },
    [KujiraMainnetDenoms.CRBRUS]: {
      name: 'CRBRUS',
      icon: '/images/denoms/crbrus.png',
      coingeckoId: 'cerberus',
    },
    [KujiraMainnetDenoms.RIO]: {
      name: 'RIO',
      icon: '/images/denoms/rio.png',
      coingeckoId: 'realio-network',
      significantFigures: 18,
    },
    [KujiraMainnetDenoms.NEWT]: {
      name: 'NEWT',
      icon: '/images/denoms/newt.png',
      coingeckoId: 'newt',
    },
    [KujiraMainnetDenoms.TORI]: {
      name: 'TORI',
      icon: '/images/denoms/tori.svg',
      coingeckoId: 'teritori',
    },
  },
  'harpoon-4': {
    [KujiraTestnetDenoms.Demo]: {
      name: 'DEMO',
      icon: 'missing',
      stable: true,
      coingeckoId: 'usd-coin',
      enabledInDcaPlus: true,
    },
    [KujiraTestnetDenoms.USK]: {
      name: 'USK',
      icon: '/images/denoms/usk.svg',
      stable: true,
      coingeckoId: 'usk',
    },
    [KujiraTestnetDenoms.Kuji]: {
      name: 'KUJI',
      icon: '/images/denoms/kuji.svg',
      coingeckoId: 'kujira',
      stakeableAndSupported: true,
      stakeable: true,
      enabledInDcaPlus: true,
    },
    [KujiraTestnetDenoms.AXL]: {
      name: 'axlUSDC',
      icon: '/images/denoms/usdc.svg',
      stable: true,
      coingeckoId: 'usd-coin',
    },
    [KujiraTestnetDenoms.LUNA]: {
      name: 'LUNA',
      icon: '/images/denoms/luna.svg',
      coingeckoId: 'terra-luna',
    },
    [KujiraTestnetDenoms.OSMO]: {
      name: 'OSMO',
      icon: '/images/denoms/osmo.svg',
      coingeckoId: 'osmosis',
    },
    [KujiraTestnetDenoms.NBTC]: {
      name: 'NBTC',
      icon: '/images/denoms/nbtc.svg',
      coingeckoId: 'bitcoin',
      enabledInDcaPlus: true,
    },
  },
  'osmosis-1': {
    [OsmosisMainnetDenoms.axlUSDC]: {
      coingeckoId: 'usd-coin',
      stable: true,
    },
    [OsmosisMainnetDenoms.AVAX]: {
      coingeckoId: 'avalanche-2',
    },
    [OsmosisMainnetDenoms.wBNB]: {
      coingeckoId: 'wbnb',
      enabledInDcaPlus: true,
    },
    [OsmosisMainnetDenoms.DAI]: {
      coingeckoId: 'dai',
      stable: true,
    },
    [OsmosisMainnetDenoms.DOT]: {
      coingeckoId: 'polkadot',
    },
    [OsmosisMainnetDenoms.wETH]: {
      enabledInDcaPlus: true,
      coingeckoId: 'weth',
      minimumSwapAmount: 0.05 / 1000,
    },
    [OsmosisMainnetDenoms.FTM]: {
      coingeckoId: 'wrapped-fantom',
    },
    [OsmosisMainnetDenoms.IST]: {
      coingeckoId: 'inter-stable-token',
      stable: true,
    },
    [OsmosisMainnetDenoms.axlUSDT]: {
      coingeckoId: 'axelar-usdt',
      stable: true,
    },
    [OsmosisMainnetDenoms.USDT]: {
      coingeckoId: 'tether',
      stable: true,
    },
    [OsmosisMainnetDenoms.ATOM]: {
      enabledInDcaPlus: true,
    },
    [OsmosisMainnetDenoms.stATOM]: {
      enabledInDcaPlus: true,
    },
    [OsmosisMainnetDenoms.wBTC]: {
      coingeckoId: 'wrapped-bitcoin',
      enabledInDcaPlus: true,
      minimumSwapAmount: 0.05 / 10000,
    },
    [OsmosisMainnetDenoms.nBTC]: {
      coingeckoId: 'bitcoin',
      enabledInDcaPlus: true,
      significantFigures: 14,
      minimumSwapAmount: 0.05 / 10000,
    },
    [OsmosisMainnetDenoms.LINK]: {
      minimumSwapAmount: 1e16,
      coingeckoId: 'chainlink',
    },
    [OsmosisMainnetDenoms.PSTAKE]: {
      coingeckoId: 'pstake-finance',
    },
    [OsmosisMainnetDenoms.PEPE]: {
      coingeckoId: 'pepe',
    },
    [OsmosisMainnetDenoms.MATIC]: {
      coingeckoId: 'matic-network',
    },
    [OsmosisMainnetDenoms.TIA]: {
      coingeckoId: 'celestia',
    },
    [OsmosisMainnetDenoms.OSMO]: {
      stakeable: true,
      stakeableAndSupported: true,
    },
    [OsmosisMainnetDenoms.USDC]: {
      stable: true,
    },
  },
  'osmo-test-5': {
    [OsmosisTestnetDenoms.USDC]: {
      coingeckoId: 'usd-coin',
      stable: true,
    },
    [OsmosisTestnetDenoms.MARS]: {
      coingeckoId: 'cosmos',
    },
    [OsmosisTestnetDenoms.OSMO]: {
      coingeckoId: 'osmosis',
    },
    [OsmosisTestnetDenoms.ION]: {
      coingeckoId: 'osmosis',
    },
    [OsmosisTestnetDenoms.ATOM]: {
      coingeckoId: 'cosmos',
    },
  },
  'constantine-3': {
    [ArchwayTestnetDenoms.CONST]: {
      coingeckoId: 'archway',
      stakeable: true,
      icon: '/images/denoms/archway.svg',
    },
    [ArchwayTestnetDenoms.xCONST]: {
      coingeckoId: 'archway',
      stakeable: true,
      icon: '/images/denoms/xconst.svg',
    },
    [ArchwayTestnetDenoms['USDC.axv']]: {
      coingeckoId: 'usd-coin',
      stable: true,
      icon: '/images/denoms/usdc.svg',
    },
    [ArchwayTestnetDenoms['ATOM.axv']]: {
      coingeckoId: 'cosmos',
      icon: '/images/denoms/atom.svg',
    },
    [ArchwayTestnetDenoms['BTC.axv']]: {
      coingeckoId: 'bitcoin',
      icon: '/images/denoms/wbtc.png',
    },
    [ArchwayTestnetDenoms['ETH.axv']]: {
      coingeckoId: 'ethereum',
      icon: '/images/denoms/weth.svg',
    },
    [ArchwayTestnetDenoms.AXL]: {
      coingeckoId: 'axelar-network',
      icon: '/images/denoms/axl.svg',
    },
    [ArchwayTestnetDenoms['USDT.axv']]: {
      coingeckoId: 'axelar-usdt',
      stable: true,
      icon: '/images/denoms/usdt.png',
    },
    [ArchwayTestnetDenoms.ASTRO]: {
      coingeckoId: 'astroport-fi',
      icon: '/images/denoms/astro.png',
    },
  },
};
