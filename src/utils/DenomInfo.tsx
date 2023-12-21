export type DenomInfo = {
  chain: string;
  id: string;
  name: string;
  icon: string;
  stakeable: boolean;
  stable: boolean;
  coingeckoId: string;
  stakeableAndSupported: boolean;
  enabled: boolean;
  minimumSwapAmount: number;
  significantFigures: number;
  enabledInDcaPlus: boolean;
  pricePrecision: number;
};

export const fromPartial = (denomInfo: Partial<DenomInfo>): DenomInfo => {
  if (!denomInfo.chain || !denomInfo.id) {
    throw new Error(`Invalid partial denom info: ${JSON.stringify(denomInfo)}`);
  }

  return {
    chain: denomInfo.chain,
    id: denomInfo.id,
    name: denomInfo.id,
    icon: '/images/circleDollar.svg',
    minimumSwapAmount: 0,
    stakeable: false,
    stable: false,
    coingeckoId: '',
    stakeableAndSupported: false,
    enabled: false,
    significantFigures: 6,
    pricePrecision: 3,
    enabledInDcaPlus: false,
    ...denomInfo,
  };
};
