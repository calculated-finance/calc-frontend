import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Text, Icon, Tooltip, Flex } from '@chakra-ui/react';
import { getPromoMessage } from '@components/Banner';
import { Denom, MainnetDenoms, TestnetDenoms } from '@models/Denom';
import { NETWORK } from 'kujira.js';
import { CHAIN_ID, featureFlags } from 'src/constants';
import { Coin } from 'src/interfaces/generated/response/get_vaults_by_address';

type DenomInfo = {
  name: string;
  icon?: string;
  conversion?: (value: number) => number;
  deconversion?: (value: number) => number;
  stakeable?: boolean;
  stable?: boolean;
  coingeckoId: string;
  stakeableAndSupported?: boolean;
  promotion?: JSX.Element;
  enabled?: boolean;
  minimumSwapAmount?: number;
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
};

export const mainnetDenoms: Record<MainnetDenoms, DenomInfo> = {
  [MainnetDenoms.ATOM]: {
    name: 'ATOM',
    icon: '/images/denoms/atom.svg',
    stakeable: true,
    coingeckoId: 'cosmos',
  },
  [MainnetDenoms.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usk',
    promotion: featureFlags.uskPromoEnabled ? (
      <Flex gap={2}>
        <Text fontSize="xs">Fee-free USK for 30 days. </Text>
        <Tooltip label={getPromoMessage()}>
          <Icon as={QuestionOutlineIcon} />
        </Tooltip>
      </Flex>
    ) : undefined,
  },
  [MainnetDenoms.Kuji]: {
    name: 'KUJI',
    icon: '/images/denoms/kuji.svg',
    coingeckoId: 'kujira',
    stakeableAndSupported: true,
  },
  [MainnetDenoms.AXL]: {
    name: 'axlUSDC',
    icon: '/images/denoms/axl.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usd-coin',
  },
  [MainnetDenoms.WETH]: {
    name: 'wETH',
    icon: '/images/denoms/weth.svg',
    stakeable: true,
    stable: false,
    coingeckoId: 'weth',
    conversion: (value: number) => value / 10 ** 18,
    deconversion: (value: number) => Math.round(value * 10 ** 18),
    enabled: false,
    minimumSwapAmount: 0.05 / 1000,
  },
};

export const testnetDenoms: Record<TestnetDenoms, DenomInfo> = {
  [TestnetDenoms.Demo]: {
    name: 'DEMO',
    stable: true,
    coingeckoId: 'usd-coin',
  },
  [TestnetDenoms.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usk',
    promotion: featureFlags.uskPromoEnabled ? (
      <Flex gap={2}>
        <Text fontSize="xs">Fee-free USK for 30 days. </Text>
        <Tooltip label={getPromoMessage()}>
          <Icon as={QuestionOutlineIcon} />
        </Tooltip>
      </Flex>
    ) : undefined,
  },
  [TestnetDenoms.Kuji]: {
    name: 'KUJI',
    icon: '/images/denoms/kuji.svg',
    coingeckoId: 'kujira',
    stakeableAndSupported: true,
  },
  [TestnetDenoms.AXL]: {
    name: 'axlUSDC',
    icon: '/images/denoms/axl.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usd-coin',
  },
  [TestnetDenoms.LUNA]: {
    name: 'LUNA',
    icon: '/images/denoms/luna.svg',
    coingeckoId: 'terra-luna',
  },
  [TestnetDenoms.OSMO]: {
    name: 'OSMO',
    icon: '/images/denoms/osmo.svg',
    coingeckoId: 'osmosis',
  },
  [TestnetDenoms.NBTC]: {
    name: 'NBTC',
    stakeable: false,
    coingeckoId: 'bitcoin',
  },
};

export function isMainnet() {
  return (CHAIN_ID as NETWORK) === 'kaiyo-1';
}

const getDenomInfo = (denom?: string) => {
  if (!denom) {
    return defaultDenom;
  }
  if (isMainnet()) {
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
