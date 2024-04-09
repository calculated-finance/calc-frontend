import { ChainId } from '@models/ChainId';
import {
  ArchwayMainnetDenoms,
  ArchwayTestnetDenoms,
  KujiraMainnetDenoms,
  KujiraTestnetDenoms,
  NeutronMainnetDenoms,
  NeutronTestnetDenoms,
  OsmosisMainnetDenoms,
  OsmosisTestnetDenoms,
} from '@models/Denom';
import { InitialDenomInfo } from '../utils/DenomInfo';

export const DENOMS: Record<ChainId, Record<string, Partial<InitialDenomInfo>>> = {
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
      enabledInDcaPlus: true,
    },
    [KujiraMainnetDenoms.STARS]: {
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
      significantFigures: 10,
      enabledInDcaPlus: true,
    },
    [KujiraMainnetDenoms.GPAXG]: {
      name: 'gPAXG',
      icon: '/images/denoms/gpaxg.svg',
      stakeable: true,
      coingeckoId: 'pax-gold',
      significantFigures: 18,
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
    [KujiraMainnetDenoms.AQLA]: {
      name: 'AQLA',
      icon: '/images/denoms/aqla.svg',
      coingeckoId: 'unknown',
    },
    [KujiraMainnetDenoms.DYM]: {
      name: 'DYM',
      icon: '/images/denoms/dymension.svg',
      coingeckoId: 'dymension',
      significantFigures: 18,
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
    [OsmosisMainnetDenoms.axlWBTC]: {
      coingeckoId: 'wrapped-bitcoin',
      enabledInDcaPlus: true,
    },
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
    },
    [OsmosisMainnetDenoms.nBTC]: {
      coingeckoId: 'bitcoin',
      enabledInDcaPlus: true,
    },
    [OsmosisMainnetDenoms.LINK]: {
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
    [OsmosisMainnetDenoms['XRP.core']]: {
      coingeckoId: 'xrp',
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
  'neutron-1': {
    [NeutronMainnetDenoms.NTRN]: {
      icon: '/images/denoms/neutron.svg',
      coingeckoId: 'neutron',
    },
    [NeutronMainnetDenoms.ATOM]: {
      icon: '/images/denoms/atom.svg',
      enabledInDcaPlus: true,
      coingeckoId: 'cosmos',
    },
    [NeutronMainnetDenoms.USDC]: {
      icon: '/images/denoms/usdc.svg',
      stable: true,
      coingeckoId: 'usd-coin',
    },
    [NeutronMainnetDenoms.ASTRO]: {
      icon: '/images/denoms/astro.png',
      coingeckoId: 'astroport-fi',
    },
  },
  'pion-1': {
    [NeutronTestnetDenoms.NTRN]: {
      icon: '/images/denoms/neutron.svg',
      coingeckoId: 'neutron',
    },
    [NeutronTestnetDenoms.ATOM]: {
      icon: '/images/denoms/atom.svg',
      enabledInDcaPlus: true,
      coingeckoId: 'cosmos',
    },
    [NeutronTestnetDenoms.USDC]: {
      icon: '/images/denoms/usdc.svg',
      stable: true,
      coingeckoId: 'usd-coin',
    },
    [NeutronTestnetDenoms.ASTRO]: {
      icon: '/images/denoms/astro.png',
      coingeckoId: 'astroport-fi',
    },
  },
  'archway-1': {
    [ArchwayMainnetDenoms.AKT]: {
      icon: '/images/denoms/akt.svg',
    },
    [ArchwayMainnetDenoms.ALTER]: {
      icon: 'https://astrovault.io/static/media/logo-alter.6e8c9d43f186f285f8ca.svg',
    },
    [ArchwayMainnetDenoms.ANDR]: {
      icon: 'https://astrovault.io/static/media/logo-andr.92aedba42e5bb9a1567c.svg',
      coingeckoId: 'andromeda-2',
    },
    [ArchwayMainnetDenoms.ARCH]: {
      icon: '/images/denoms/archway.svg',
      coingeckoId: 'archway',
      stakeable: true,
      stakeableAndSupported: true,
      significantFigures: 18,
    },
    [ArchwayMainnetDenoms.ATOM]: {
      icon: '/images/denoms/atom.svg',
      enabledInDcaPlus: true,
    },
    [ArchwayMainnetDenoms.AXV]: {
      icon: 'https://astrovault.io/static/media/logo-axv.5f0b26624713d87c354e.svg',
      coingeckoId: 'astrovault',
    },
    [ArchwayMainnetDenoms.BLD]: {
      icon: 'https://astrovault.io/static/media/logo-bld.cce5f5d778d21520feb0.svg',
      coingeckoId: 'agoric',
    },
    [ArchwayMainnetDenoms.DEC]: {
      icon: 'https://astrovault.io/static/media/logo-dec.5d1099ecf235c58f1e2e.svg',
    },
    [ArchwayMainnetDenoms.GRAV]: {
      icon: 'https://astrovault.io/static/media/logo-grav.50603ca3f3af799ef868.svg',
    },
    [ArchwayMainnetDenoms.xGRAV]: {
      icon: 'https://astrovault.io/static/media/logo-xgrav.392ea340ed2346825631.svg',
      coingeckoId: 'graviton',
    },
    [ArchwayMainnetDenoms.xARCH]: {
      icon: 'https://astrovault.io/static/media/logo-xarch.443706fdbdaa8ec3059f.svg',
      coingeckoId: 'archway',
    },
    [ArchwayMainnetDenoms.xAKT]: {
      icon: 'https://astrovault.io/static/media/logo-xakt.27a88ec2f6afb53e91f4.svg',
      coingeckoId: 'akash-network',
    },
    [ArchwayMainnetDenoms.xATOM]: {
      icon: 'https://astrovault.io/static/media/logo-xatom.daac6b0df6cab97834b3.svg',
      coingeckoId: 'cosmos',
      enabledInDcaPlus: true,
    },
    [ArchwayMainnetDenoms.xBLD]: {
      icon: 'https://astrovault.io/static/media/logo-xbld.f0978297a4fbb94914a1.svg',
      coingeckoId: 'agoric',
    },
    [ArchwayMainnetDenoms.xDEC]: {
      icon: 'https://astrovault.io/static/media/logo-xdec.f3c06ad600b9d27397ee.svg',
      coingeckoId: 'decentr',
    },
    [ArchwayMainnetDenoms.IST]: {
      icon: 'https://astrovault.io/static/media/logo-ist.7cfe03e9df8e95a39620.svg',
      stable: true,
      enabledInDcaPlus: true,
    },
    [ArchwayMainnetDenoms.JKL]: {
      icon: 'https://astrovault.io/static/media/logo-jkl.775e0818c92acfa58f36.svg',
      coingeckoId: 'jackal-protocol',
    },
    [ArchwayMainnetDenoms.xJKL]: {
      icon: 'https://astrovault.io/static/media/logo-xjkl.b5e57acef59cdbc18f33.svg',
      coingeckoId: 'jackal-protocol',
    },
    [ArchwayMainnetDenoms.LVN]: {
      icon: 'https://astrovault.io/static/media/logo-lvn.196cf2fec123062e9b96.svg',
    },
    [ArchwayMainnetDenoms.MPWR]: {
      icon: 'https://astrovault.io/static/media/logo-mpwr.1e64148f0584b0b4acb2.svg',
      coingeckoId: 'clubrare-empower',
    },
    [ArchwayMainnetDenoms.xMPWR]: {
      icon: 'https://astrovault.io/static/media/logo-xmpwr.f9bb01f39c6dc68f3495.svg',
      coingeckoId: 'clubrare-empower',
    },
    [ArchwayMainnetDenoms.PLQ]: {
      icon: 'https://astrovault.io/static/media/logo-plq.90dd239427758bf50c90.svg',
    },
    [ArchwayMainnetDenoms.xPLQ]: {
      icon: 'https://astrovault.io/static/media/logo-xplq.164fe915be23486f20da.svg',
      coingeckoId: 'planq',
    },
    [ArchwayMainnetDenoms.axlUSDC]: {
      icon: 'https://astrovault.io/static/media/logo-usdc.axl.a191012589309094d837.svg',
      stable: true,
    },
    [ArchwayMainnetDenoms.USDC]: {
      icon: 'https://astrovault.io/static/media/logo-usdc.nobl.bf893ef8c8414cb29520.svg',
      stable: true,
    },
    [ArchwayMainnetDenoms.gravUSDC]: {
      icon: 'https://astrovault.io/static/media/logo-usdc.grav.c884abd5db71c6605def.svg',
      stable: true,
    },
    [ArchwayMainnetDenoms.gravUSDT]: {
      icon: 'https://astrovault.io/static/media/logo-usdt.grav.1c50785c9a42c563a1b6.svg',
      stable: true,
    },
    [ArchwayMainnetDenoms.axlBTC]: {
      icon: 'https://astrovault.io/static/media/logo-wbtc.axl.82bde40ecf2b5608fec5.svg',
      enabledInDcaPlus: true,
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
      coingeckoId: 'axelar',
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
    [ArchwayTestnetDenoms.sARCH]: {
      coingeckoId: 'archway',
    },
  },
};
