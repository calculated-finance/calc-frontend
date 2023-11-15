import { GasPrice } from '@cosmjs/stargate';
import { ChainId } from '@hooks/useChain/Chains';
import { ChainInfo } from '@keplr-wallet/types';
import { isMainnet } from '@utils/isMainnet';
import { CHAIN_INFO } from 'kujira.js';

const osmoMainnetConfig = {
  chainId: 'osmosis-1',
  chainName: 'Osmosis Mainnet',
  rpc: 'https://rpc.osmosis.zone',
  rest: 'https://lcd.osmosis.zone',
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'osmo',
    bech32PrefixAccPub: 'osmopub',
    bech32PrefixValAddr: 'osmovaloper',
    bech32PrefixValPub: 'osmovaloperpub',
    bech32PrefixConsAddr: 'osmovalcons',
    bech32PrefixConsPub: 'osmovalconspub',
  },
  currencies: [
    {
      coinDenom: 'OSMO',
      coinMinimalDenom: 'uosmo',
      coinDecimals: 6,
      coinGeckoId: 'osmosis',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'OSMO',
      coinMinimalDenom: 'uosmo',
      coinDecimals: 6,
      coinGeckoId: 'osmosis',
      gasPriceStep: {
        low: 0.00125,
        average: 0.0025,
        high: 0.00375,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: 'OSMO',
    coinMinimalDenom: 'uosmo',
    coinDecimals: 6,
    coinGeckoId: 'osmosis',
  },
  coinType: 118,
} as ChainInfo;

const osmoTestnetConfig = {
  chainId: 'osmo-test-5',
  chainName: 'Osmosis (osmo-test-5)',
  rpc: 'https://rpc.osmotest5.osmosis.zone',
  rest: 'https://lcd.osmotest5.osmosis.zone',
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'osmo',
    bech32PrefixAccPub: 'osmopub',
    bech32PrefixValAddr: 'osmovaloper',
    bech32PrefixValPub: 'osmovaloperpub',
    bech32PrefixConsAddr: 'osmovalcons',
    bech32PrefixConsPub: 'osmovalconspub',
  },
  currencies: [
    {
      coinDenom: 'OSMO',
      coinMinimalDenom: 'uosmo',
      coinDecimals: 6,
      coinGeckoId: 'osmosis',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'OSMO',
      coinMinimalDenom: 'uosmo',
      coinDecimals: 6,
      coinGeckoId: 'osmosis',
      gasPriceStep: {
        low: 0.00125,
        average: 0.0025,
        high: 0.00375,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: 'OSMO',
    coinMinimalDenom: 'uosmo',
    coinDecimals: 6,
    coinGeckoId: 'osmosis',
  },
  coinType: 118,
} as ChainInfo;

export function getGasPrice(chain: ChainId) {
  return GasPrice.fromString(
    {
      'osmosis-1': '0.015uosmo',
      'osmo-test-5': '0.015uosmo',
      'kaiyo-1': '0.015ukuji',
      'harpoon-4': '0.015ukuji',
    }[chain],
  );
}

export function getChainInfo(chain: ChainId) {
  return {
    'osmosis-1': osmoMainnetConfig,
    'osmo-test-5': osmoTestnetConfig,
    'kaiyo-1': CHAIN_INFO['kaiyo-1'],
    'harpoon-4': { ...CHAIN_INFO['harpoon-4'], rpc: 'https://kujira-testnet-rpc.polkachu.com/' },
  }[chain] as ChainInfo;
}

export function getFeeCurrencies(chain: ChainId) {
  return getChainInfo(chain).feeCurrencies.filter(
    (x) =>
      x.coinMinimalDenom ===
      {
        'osmosis-1': 'uosmo',
        'osmo-test-5': 'uosmo',
        'kaiyo-1': 'ukuji',
        'harpoon-4': 'ukuji',
      }[chain],
  );
}

export function getChainEndpoint(chain: ChainId): string {
  console.log('getChainEndpoint', chain, getChainInfo(chain));
  return getChainInfo(chain).rpc;
}

export function getChainContractAddress(chain: ChainId) {
  return {
    'osmosis-1': 'osmo1zacxlu90sl6j2zf90uctpddhfmux84ryrw794ywnlcwx2zeh5a4q67qtc9',
    'osmo-test-5': 'osmo1sk0qr7kljlsas09tn8lgh4zfcskwx76p4gypmwtklq2883pun3gs8rhs7f',
    'kaiyo-1': 'kujira1e6fjnq7q20sh9cca76wdkfg69esha5zn53jjewrtjgm4nktk824stzyysu',
    'harpoon-4': 'kujira1hvfe75f6gsse9jh3r02zy4e6gl8fg7r4ktznwwsg94npspqkcm8stq56d7',
  }[chain]!;
}

export function getAutocompoundStakingRewardsAddress(chain: ChainId): string {
  return {
    'osmosis-1': 'osmo1xqr6ew6x4qkxe832hhjmfpu9du9vnkhx626kj2',
    'osmo-test-5': 'osmo1xqr6ew6x4qkxe832hhjmfpu9du9vnkhx626kj2',
    'kaiyo-1': 'kujira1xqr6ew6x4qkxe832hhjmfpu9du9vnkhxret7fj',
    'harpoon-4': 'kujira1xqr6ew6x4qkxe832hhjmfpu9du9vnkhxret7fj',
  }[chain];
}

export function getChainFeeTakerAddress(chain: ChainId) {
  return {
    'osmosis-1': 'osmo1263dq8542dgacr5txhdrmtxpup6px7g7tteest',
    'osmo-test-5': 'osmo1263dq8542dgacr5txhdrmtxpup6px7g7tteest',
    'kaiyo-1': 'osmo16q6jpx7ns0ugwghqay73uxd5aq30du3uemhp54',
    'harpoon-4': 'osmo16q6jpx7ns0ugwghqay73uxd5aq30du3uemhp54',
  }[chain];
}

export function getChainStakingRouterContractAddress(chain: ChainId) {
  return getChainContractAddress(chain);
}

export function getChainId(chain: ChainId) {
  return chain;
}

export function getChainDexName(chain: ChainId) {
  return {
    'osmosis-1': 'Osmosis',
    'osmo-test-5': 'Osmosis',
    'kaiyo-1': 'FIN',
    'harpoon-4': 'FIN',
  }[chain];
}

export function getChainAddressPrefix(chain: ChainId) {
  return {
    'osmosis-1': 'osmo',
    'osmo-test-5': 'osmo',
    'kaiyo-1': 'kujira',
    'harpoon-4': 'kujira',
  }[chain];
}

export function getChainAddressLength(chain: ChainId) {
  return {
    'osmosis-1': 43,
    'osmo-test-5': 43,
    'kaiyo-1': 45,
    'harpoon-4': 45,
  }[chain];
}

export function getOsmosisWebUrl() {
  if (isMainnet()) {
    return 'https://app.osmosis.zone';
  }
  return 'https://testnet.osmosis.zone';
}

export function getRedBankAddress() {
  return isMainnet()
    ? 'osmo1c3ljch9dfw5kf52nfwpxd2zmj2ese7agnx0p9tenkrryasrle5sqf3ftpg'
    : 'osmo1dl4rylasnd7mtfzlkdqn2gr0ss4gvyykpvr6d7t5ylzf6z535n9s5jjt8u';
}

export function getMarsParamsAddress() {
  return isMainnet()
    ? 'osmo1nlmdxt9ctql2jr47qd4fpgzg84cjswxyw6q99u4y4u4q6c2f5ksq7ysent'
    : 'osmo1h334tvddn82m4apm08rm9k6kt32ws7vy0c4n30ngrvu6h6yxh8eq9l9jfh';
}

export function getMarsUrl() {
  return isMainnet() ? 'https://mars.osmosis.zone' : 'https://testnet-osmosis.marsprotocol.io/';
}

export enum ChainType {
  Cosmos = 'cosmos',
  EVM = 'evm',
}

export type ChainConfig = {
  name: ChainId;
  chainType: ChainType;
  contractAddress: string;
  feeTakerAddress: string;
  autoCompoundStakingRewardsAddress: string;
};

export function getChainConfig(chain: ChainId) {
  if (!chain) {
    return undefined;
  }
  return {
    name: chain,
    chainType: ChainType.Cosmos,
    contractAddress: getChainContractAddress(chain),
    feeTakerAddress: getChainFeeTakerAddress(chain),
    autoCompoundStakingRewardsAddress: getAutocompoundStakingRewardsAddress(chain),
  };
}
