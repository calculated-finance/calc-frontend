import { Denom } from '@models/Denom';

export type DenomInfo = {
  id: Denom;
  name: string;
  icon: string;
  conversion: (value: number) => number;
  deconversion: (value: number) => number;
  priceDeconversion: (value: number | undefined | null) => number;
  priceConversion: (value: number | undefined | null) => number;
  stakeable: boolean;
  stable: boolean;
  coingeckoId: string;
  stakeableAndSupported: boolean;
  promotion?: JSX.Element;
  enabled: boolean;
  minimumSwapAmount: number;
  significantFigures: number;
  enabledInDcaPlus: boolean;
  osmosisId?: string;
  pricePrecision: number;
};
