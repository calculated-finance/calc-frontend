import * as Sentry from '@sentry/react';
import { Denom, MainnetDenoms, TestnetDenoms, TestnetDenomsOsmosis, MainnetDenomsOsmosis } from '@models/Denom';
import { Coin } from 'src/interfaces/v2/generated/response/get_vaults_by_address';
import { useAssetListStore } from '@hooks/useCachedAssetList';
import { isNil } from 'lodash';
import { DenomInfo } from './DenomInfo';
import { defaultDenom } from './defaultDenom';
import { mainnetDenomsKujira } from './mainnetDenomsKujira';
import { mainnetDenomsOsmosis } from './mainnetDenomsOsmosis';
import { testnetDenomsKujira } from './testnetDenomsKujira';
import { testnetDenomsOsmosis } from './testnetDenomsOsmosis';

function isDenomInStablesList(denom: Denom) {
  return { ...mainnetDenomsOsmosis, ...testnetDenomsOsmosis }[denom as MainnetDenomsOsmosis | TestnetDenomsOsmosis]
    ?.stable;
}

const getDenomInfo = (denom: string | undefined): DenomInfo => {
  if (!denom) {
    return {
      id: '',
      ...defaultDenom,
    };
  }

  const { assetList } = useAssetListStore.getState();

  const asset = assetList?.[denom];

  if (asset) {
    const findDenomUnits = asset.denom_units.find((du) => du.denom === asset.display);
    const significantFigures = findDenomUnits?.exponent || 6;

    const denoms = { ...mainnetDenomsOsmosis, ...testnetDenomsOsmosis };
    const scopedDenom = denom as MainnetDenomsOsmosis | TestnetDenomsOsmosis;

    let denomInfo = {
      name: asset.symbol,
      icon: asset.logo_URIs?.svg || asset.logo_URIs?.png,
      stakeable: !isDenomInStablesList(denom as Denom),
      stable: isDenomInStablesList(denom as Denom),
      coingeckoId: asset.coingecko_id || denoms[scopedDenom]?.coingeckoId || '',
      osmosisId: asset.symbol,
      enabledInDcaPlus: denoms[scopedDenom]?.enabledInDcaPlus,
      significantFigures,
      pricePrecision: 6,
      stakeableAndSupported: denom === 'uosmo',
    } as Partial<DenomInfo>;

    if (!isNil(significantFigures) && significantFigures !== 6) {
      denomInfo = {
        ...denomInfo,
        conversion: (value: number) => value / 10 ** significantFigures,
        deconversion: (value: number) => Math.round(value * 10 ** significantFigures),
        priceDeconversion: (value: number | null | undefined) => Number(value) * 10 ** (significantFigures - 6),
        priceConversion: (value: number | null | undefined) => Number(value) / 10 ** (significantFigures - 6),
        minimumSwapAmount: 0.05 / 1000,
      };
    }

    return {
      id: denom,
      ...defaultDenom,
      ...denoms[scopedDenom],
      ...denomInfo,
    };
  }

  const kujiraDenoms = { ...mainnetDenomsKujira, ...testnetDenomsKujira };
  const kujiraAsset = kujiraDenoms[denom as MainnetDenoms | TestnetDenoms];

  if (kujiraAsset) {
    return {
      id: denom,
      ...defaultDenom,
      ...kujiraAsset,
    };
  }

  Sentry.captureException("didn't find a denom", { tags: { denom } });

  return {
    id: denom,
    ...defaultDenom,
  };
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
