import { GasPrice } from '@cosmjs/stargate';
import { ChainId } from '@models/ChainId';
import {
  ARCHWAY_TESTNET_RPC,
  COSMOS_KIT_ARCHWAY_TESTNET,
  COSMOS_KIT_KUJIRA_MAINNET,
  COSMOS_KIT_KUJIRA_TESTNET,
  COSMOS_KIT_OSMOSIS_MAINNET,
  COSMOS_KIT_OSMOSIS_TESTNET,
  KUJIRA_MAINNET_RPC,
  KUJIRA_TESTNET_RPC,
  OSMOSIS_MAINNET_RPC,
  OSMOSIS_TESTNET_RPC,
} from 'src/constants';

export function getGasPrice(chain: ChainId) {
  return GasPrice.fromString(
    {
      'osmosis-1': '0.004uosmo',
      'osmo-test-5': '0.004uosmo',
      'kaiyo-1': '0.004ukuji',
      'harpoon-4': '0.004ukuji',
      'constantine-3': '0.004aconst',
    }[chain],
  );
}

export function getChainEndpoint(chain: ChainId): string {
  return {
    'osmosis-1': OSMOSIS_MAINNET_RPC,
    'osmo-test-5': OSMOSIS_TESTNET_RPC,
    'kaiyo-1': KUJIRA_MAINNET_RPC,
    'harpoon-4': KUJIRA_TESTNET_RPC,
    'constantine-3': ARCHWAY_TESTNET_RPC,
  }[chain];
}

export function getChainContractAddress(chainId: ChainId) {
  return {
    'osmosis-1': 'osmo1zacxlu90sl6j2zf90uctpddhfmux84ryrw794ywnlcwx2zeh5a4q67qtc9',
    'osmo-test-5': 'osmo1sk0qr7kljlsas09tn8lgh4zfcskwx76p4gypmwtklq2883pun3gs8rhs7f',
    'kaiyo-1': 'kujira1e6fjnq7q20sh9cca76wdkfg69esha5zn53jjewrtjgm4nktk824stzyysu',
    'harpoon-4': 'kujira1hvfe75f6gsse9jh3r02zy4e6gl8fg7r4ktznwwsg94npspqkcm8stq56d7',
    'constantine-3': 'archway1c637d76dhl8qhe5mc4fu8nqlvjugkc70y8yt2uemsf3n75gkjvfq00wf7s',
  }[chainId]!;
}

export function getAutoCompoundStakingRewardsAddress(chainId: ChainId): string {
  return {
    'osmosis-1': 'osmo1xqr6ew6x4qkxe832hhjmfpu9du9vnkhx626kj2',
    'osmo-test-5': 'osmo1xqr6ew6x4qkxe832hhjmfpu9du9vnkhx626kj2',
    'kaiyo-1': 'kujira1xqr6ew6x4qkxe832hhjmfpu9du9vnkhxret7fj',
    'harpoon-4': 'kujira1xqr6ew6x4qkxe832hhjmfpu9du9vnkhxret7fj',
    'constantine-3': '',
  }[chainId];
}

export function getChainFeeTakerAddress(chainId: ChainId) {
  return {
    'osmosis-1': 'osmo1263dq8542dgacr5txhdrmtxpup6px7g7tteest',
    'osmo-test-5': 'osmo1263dq8542dgacr5txhdrmtxpup6px7g7tteest',
    'kaiyo-1': 'kujira1vq6vrr4nu0w4mmu36pkznzqddmdlf4r5w3qpxy',
    'harpoon-4': 'kujira10fmz64pwj95qy3rgjm0kud2uz62thp3s88ajca',
    'constantine-3': 'archway1y4k0re9q905nvvcvvmxug3sqtd9e7du46vm3gk',
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
    'constantine-3': COSMOS_KIT_ARCHWAY_TESTNET,
  }[chainId];
}

export function getChainId(chainName: string): string {
  return {
    osmosis: 'osmosis-1',
    osmosistestnet: 'osmo-test-5',
    kujira: 'kaiyo-1',
    kujiratestnet: 'harpoon-4',
    archwaytestnet: 'constantine-3',
  }[chainName]!;
}

export function getChainDexName(chainId: ChainId) {
  return {
    'osmosis-1': 'Osmosis',
    'osmo-test-5': 'Osmosis',
    'kaiyo-1': 'FIN',
    'harpoon-4': 'FIN',
    'constantine-3': 'Astrovault',
  }[chainId];
}

export function getChainAddressPrefix(chainId: ChainId) {
  return {
    'osmosis-1': 'osmo',
    'osmo-test-5': 'osmo',
    'kaiyo-1': 'kujira',
    'harpoon-4': 'kujira',
    'constantine-3': 'archway',
  }[chainId];
}

export function getChainAddressLength(chainId: ChainId) {
  return {
    'osmosis-1': [43, 63],
    'osmo-test-5': [43, 63],
    'kaiyo-1': [45, 65],
    'harpoon-4': [45, 65],
    'constantine-3': [46, 66],
  }[chainId];
}

export function getStrategiesFetchLimit(chainId: ChainId) {
  return {
    'osmosis-1': process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 1000 : 100,
    'osmo-test-5': 100,
    'kaiyo-1': 100,
    'harpoon-4': 100,
    'constantine-3': 100,
  }[chainId];
}

export function getEventsFetchLimit(chainId: ChainId) {
  return {
    'osmosis-1': process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 1000 : 200,
    'osmo-test-5': 200,
    'kaiyo-1': 200,
    'harpoon-4': 200,
    'constantine-3': 200,
  }[chainId];
}

export function getPairsFetchLimit(chainId: ChainId) {
  return {
    'osmosis-1': process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 1000 : 200,
    'osmo-test-5': 200,
    'kaiyo-1': 200,
    'harpoon-4': 200,
    'constantine-3': 200,
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
    'osmo-test-5': 'https://sqs.testnet.osmosis.zone',
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
    autoCompoundStakingRewardsAddress: getAutoCompoundStakingRewardsAddress(chainId),
  };
}
