import * as Sentry from '@sentry/react';
import { Denom, MainnetDenoms, TestnetDenoms, TestnetDenomsOsmosis, MainnetDenomsOsmosis, TestnetDenomsMoonbeam } from '@models/Denom';
import { Coin } from 'src/interfaces/v2/generated/response/get_vaults_by_address';
import { useAssetListStore } from '@hooks/useCachedAssetList';
import { isNil } from 'lodash';
import { isMainnet } from './isMainnet';
import { DenomInfo } from './DenomInfo';
import { defaultDenom } from './defaultDenom';
import { mainnetDenoms } from './mainnetDenoms';
import { mainnetDenomsOsmosis } from './mainnetDenomsOsmosis';
import { testnetDenoms } from './testnetDenoms';
import { testnetDenomsMoonbeam } from './testnetDenomsMoonbeam';

const stableDenomsTestnet = [TestnetDenomsOsmosis.AXL.toString()];

function isDenomInStablesList(denom: Denom) {
  if (isMainnet()) {
    return mainnetDenomsOsmosis[denom as MainnetDenomsOsmosis]?.stable;
  }
  return stableDenomsTestnet.includes(denom);
}

const getDenomInfo = (denom: string | undefined): DenomInfo => {
  if (!denom) {
    return {
      id: '',
      ...defaultDenom,
    };
  }

  const { assetList } = useAssetListStore.getState();



  const asset = assetList?.assets && assetList.assets.find((a) => a.base === denom);

  if (asset) {
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
        id: denom,
        ...defaultDenom,
        ...mainnetDenomsOsmosis[denom as MainnetDenomsOsmosis],
        ...mapTo,
      };
    }
    return {
      id: denom,
      ...defaultDenom,
      ...testnetDenoms[denom as TestnetDenoms],
      ...mapTo,
    };
  }

  const kujiraMainnetAsset = mainnetDenoms[denom as MainnetDenoms];

  if (kujiraMainnetAsset) {
    return {
      id: denom,
      ...defaultDenom,
      ...kujiraMainnetAsset,
    };
  }

  const moonbeamTestnetAsset = testnetDenomsMoonbeam[denom.toLowerCase() as TestnetDenomsMoonbeam];
  if (moonbeamTestnetAsset) {
    return {
      ...defaultDenom,
      ...moonbeamTestnetAsset,
      minimumSwapAmount: 0.05 / 1000,
      conversion: (value: number) => value / 10 ** 18,
      deconversion: (value: number) => Math.round(value * 10 ** 18),
      id: denom,
    };
  }

  const kujiraTestnetAsset = testnetDenoms[denom as TestnetDenoms];

  if (kujiraTestnetAsset) {
    return {
      id: denom,
      ...defaultDenom,
      ...testnetDenoms[denom as TestnetDenoms],
    };
  }


  Sentry.captureException('didint find a denom', { tags: { denom } });
  return {
    id: denom,
    ...defaultDenom,
  }
  
};

export function getDenomName(denomInfo: DenomInfo) {
  return denomInfo.name;
}

export function convertDenomFromCoin(coin: Coin | undefined) {
  if (!coin) {
    return 0;
  }
  const denomInfo = getDenomInfo(coin.denom);
  if (!denomInfo) {
    return 0;
  }
  const { significantFigures, conversion } = denomInfo;
  return Number(conversion(Number(coin.amount)).toFixed(significantFigures));
}

export function getDenomMinimumSwapAmount(denom: Denom) {
  return getDenomInfo(denom)?.minimumSwapAmount;
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
    const { conversion } = getDenomInfo(this.denomId) || {};
    if (!conversion) {
      return 0;
    }
    return parseFloat(conversion(this.amount).toFixed(6));
  }
}

export function isDenomStable(denom: DenomInfo | undefined) {
  return denom?.stable;
}
export function isDenomVolatile(denom: DenomInfo | undefined) {
  return !isDenomStable(denom);
}

export default getDenomInfo;
