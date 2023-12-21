import { GasPrice } from '@cosmjs/stargate';
import { ChainId } from '@hooks/useChainId/Chains';
import { ChainInfo } from '@keplr-wallet/types';
import { CHAIN_INFO } from 'kujira.js';
import {
  COSMOS_KIT_KUJIRA_MAINNET,
  COSMOS_KIT_KUJIRA_TESTNET,
  COSMOS_KIT_OSMOSIS_MAINNET,
  COSMOS_KIT_OSMOSIS_TESTNET,
  KUJIRA_MAINNET_RPC,
  KUJIRA_TESTNET_RPC,
  OSMOSIS_MAINNET_RPC,
  OSMOSIS_TESTNET_RPC,
} from 'src/constants';

const osmoMainnetConfig = {
  chainId: 'osmosis-1',
  chainName: 'osmosis',
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
  chainName: 'osmosistestnet',
  rpc: 'https://rpc.osmotest5.osmosis.zone/',
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
      'osmosis-1': '0.0036uosmo',
      'osmo-test-5': '0.0036uosmo',
      'kaiyo-1': '0.0034ukuji',
      'harpoon-4': '0.0034ukuji',
    }[chain],
  );
}

export function getChainInfo(chainId: ChainId) {
  return {
    'osmosis-1': { ...osmoMainnetConfig, rpc: OSMOSIS_MAINNET_RPC },
    'osmo-test-5': { ...osmoTestnetConfig, rpc: OSMOSIS_TESTNET_RPC },
    'kaiyo-1': { ...CHAIN_INFO['kaiyo-1'], rpc: KUJIRA_MAINNET_RPC, chainName: 'kujira' },
    'harpoon-4': {
      ...CHAIN_INFO['harpoon-4'],
      rpc: KUJIRA_TESTNET_RPC,
      chainName: 'kujiratestnet',
    },
  }[chainId ?? 'kaiyo-1'] as ChainInfo;
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
  return getChainInfo(chain).rpc;
}

export function getChainContractAddress(chainId: ChainId) {
  return {
    'osmosis-1': 'osmo1zacxlu90sl6j2zf90uctpddhfmux84ryrw794ywnlcwx2zeh5a4q67qtc9',
    'osmo-test-5': 'osmo1sk0qr7kljlsas09tn8lgh4zfcskwx76p4gypmwtklq2883pun3gs8rhs7f',
    'kaiyo-1': 'kujira1e6fjnq7q20sh9cca76wdkfg69esha5zn53jjewrtjgm4nktk824stzyysu',
    'harpoon-4': 'kujira1hvfe75f6gsse9jh3r02zy4e6gl8fg7r4ktznwwsg94npspqkcm8stq56d7',
  }[chainId]!;
}

export function getAutocompoundStakingRewardsAddress(chainId: ChainId): string {
  return {
    'osmosis-1': 'osmo1xqr6ew6x4qkxe832hhjmfpu9du9vnkhx626kj2',
    'osmo-test-5': 'osmo1xqr6ew6x4qkxe832hhjmfpu9du9vnkhx626kj2',
    'kaiyo-1': 'kujira1xqr6ew6x4qkxe832hhjmfpu9du9vnkhxret7fj',
    'harpoon-4': 'kujira1xqr6ew6x4qkxe832hhjmfpu9du9vnkhxret7fj',
  }[chainId];
}

export function getChainFeeTakerAddress(chainId: ChainId) {
  return {
    'osmosis-1': 'osmo1263dq8542dgacr5txhdrmtxpup6px7g7tteest',
    'osmo-test-5': 'osmo1263dq8542dgacr5txhdrmtxpup6px7g7tteest',
    'kaiyo-1': 'kujira1vq6vrr4nu0w4mmu36pkznzqddmdlf4r5w3qpxy',
    'harpoon-4': 'kujira10fmz64pwj95qy3rgjm0kud2uz62thp3s88ajca',
  }[chainId];
}

export function getChainStakingRouterContractAddress(chainId: ChainId) {
  return getChainContractAddress(chainId);
}

export function getChainName(chainId: ChainId) {
  return {
    'osmosis-1': COSMOS_KIT_OSMOSIS_MAINNET,
    'osmo-test-5': COSMOS_KIT_OSMOSIS_TESTNET,
    'kaiyo-1': COSMOS_KIT_KUJIRA_MAINNET,
    'harpoon-4': COSMOS_KIT_KUJIRA_TESTNET,
  }[chainId];
}

export function getChainDexName(chainId: ChainId) {
  return {
    'osmosis-1': 'Osmosis',
    'osmo-test-5': 'Osmosis',
    'kaiyo-1': 'FIN',
    'harpoon-4': 'FIN',
  }[chainId];
}

export function getChainAddressPrefix(chainId: ChainId) {
  return {
    'osmosis-1': 'osmo',
    'osmo-test-5': 'osmo',
    'kaiyo-1': 'kujira',
    'harpoon-4': 'kujira',
  }[chainId];
}

export function getChainAddressLength(chainId: ChainId) {
  return {
    'osmosis-1': 43,
    'osmo-test-5': 43,
    'kaiyo-1': 45,
    'harpoon-4': 45,
  }[chainId];
}

export function getOsmosisWebUrl(chainId: ChainId) {
  return {
    'osmosis-1': 'https://app.osmosis.zone',
    'osmo-test-5': 'https://testnet.osmosis.zone',
  }[chainId as string]!;
}

export function getOsmosisRouterUrl(chainId: ChainId) {
  return {
    'osmosis-1': 'https://sqs.osmosis.zone',
    'osmo-test-5': 'https://sqs-stage.osmosis.zone',
  }[chainId as string]!;
}

export function getRedBankAddress(chainId: ChainId) {
  return {
    'osmosis-1': 'osmo1c3ljch9dfw5kf52nfwpxd2zmj2ese7agnx0p9tenkrryasrle5sqf3ftpg',
    'osmo-test-5': 'osmo1dl4rylasnd7mtfzlkdqn2gr0ss4gvyykpvr6d7t5ylzf6z535n9s5jjt8u',
  }[chainId as string]!;
}

export function getMarsParamsAddress(chainId: ChainId) {
  return {
    'osmosis-1': 'osmo1nlmdxt9ctql2jr47qd4fpgzg84cjswxyw6q99u4y4u4q6c2f5ksq7ysent',
    'osmo-test-5': 'osmo1h334tvddn82m4apm08rm9k6kt32ws7vy0c4n30ngrvu6h6yxh8eq9l9jfh',
  }[chainId as string]!;
}

export function getMarsUrl(chainId: ChainId) {
  return {
    'osmosis-1': 'https://mars.osmosis.zone',
    'osmo-test-5': 'https://testnet-osmosis.marsprotocol.io/',
  }[chainId as string]!;
}

export enum ChainType {
  Cosmos = 'cosmos',
  EVM = 'evm',
}

export type ChainConfig = {
  id: ChainId;
  chainType: ChainType;
  contractAddress: string;
  feeTakerAddress: string;
  autoCompoundStakingRewardsAddress: string;
};

export function getChainConfig(chainId: ChainId) {
  if (!chainId) {
    return undefined;
  }
  return {
    id: chainId,
    chainType: ChainType.Cosmos,
    contractAddress: getChainContractAddress(chainId),
    feeTakerAddress: getChainFeeTakerAddress(chainId),
    autoCompoundStakingRewardsAddress: getAutocompoundStakingRewardsAddress(chainId),
  };
}
