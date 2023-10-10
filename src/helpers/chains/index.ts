import { GasPrice } from '@cosmjs/stargate';
import { Chains } from '@hooks/useChain/Chains';
import { ChainInfo } from '@keplr-wallet/types';
import { isMainnet } from '@utils/isMainnet';
import { CHAIN_INFO } from 'kujira.js';
import {
  CHAIN_ID,
  CONTRACT_ADDRESS,
  FEE_TAKER_ADDRESS,
  OSMOSIS_RPC_ENDPOINT_MAINNET,
  RPC_ENDPOINT,
} from 'src/constants';

const osmoMainnetConfig = {
  chainId: 'osmosis-1',
  chainName: 'Osmosis Mainnet',
  rpc: OSMOSIS_RPC_ENDPOINT_MAINNET,
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

export function getGasPrice(chain: Chains) {
  if (chain === Chains.Osmosis) {
    return GasPrice.fromString('0.015uosmo');
  }
  return GasPrice.fromString('0.015ukuji');
}

export function getChainInfo(chain: Chains) {
  if (chain === Chains.Osmosis) {
    if (isMainnet()) {
      return osmoMainnetConfig;
    }
    return osmoTestnetConfig;
  }
  return CHAIN_INFO[CHAIN_ID];
}

export function getFeeCurrencies(chain: Chains) {
  if (chain === Chains.Osmosis) {
    return getChainInfo(chain).feeCurrencies.filter((x) => x.coinMinimalDenom === 'uosmo');
  }
  return getChainInfo(chain).feeCurrencies.filter((x) => x.coinMinimalDenom === 'ukuji');
}

export function getChainEndpoint(chain: Chains) {
  if (chain === Chains.Osmosis) {
    return getChainInfo(chain).rpc;
  }
  return RPC_ENDPOINT;
}

export function getChainContractAddress(chain: Chains) {
  if (chain === Chains.Osmosis) {
    if (isMainnet()) {
      return 'osmo1zacxlu90sl6j2zf90uctpddhfmux84ryrw794ywnlcwx2zeh5a4q67qtc9';
    }
    return 'osmo1sk0qr7kljlsas09tn8lgh4zfcskwx76p4gypmwtklq2883pun3gs8rhs7f';
  }

  return CONTRACT_ADDRESS;
}

export function getAutocompoundStakingRewardsAddress(chain: Chains): string {
  return chain === Chains.Osmosis
    ? 'osmo1xqr6ew6x4qkxe832hhjmfpu9du9vnkhx626kj2'
    : 'kujira1xqr6ew6x4qkxe832hhjmfpu9du9vnkhxret7fj';
}

export function getChainFeeTakerAddress(chain: Chains) {
  if (chain === Chains.Osmosis) {
    if (isMainnet()) {
      return 'osmo1263dq8542dgacr5txhdrmtxpup6px7g7tteest';
    }
    return 'osmo16q6jpx7ns0ugwghqay73uxd5aq30du3uemhp54';
  }

  return FEE_TAKER_ADDRESS;
}

export function getChainStakingRouterContractAddress(chain: Chains) {
  return getChainContractAddress(chain);
}

export function getChainId(chain: Chains) {
  if (chain === Chains.Osmosis) {
    return getChainInfo(chain).chainId;
  }
  return CHAIN_ID;
}

export function getChainDexName(chain: Chains) {
  if (chain === Chains.Osmosis) {
    return 'Osmosis';
  }

  if (chain === Chains.Moonbeam) {
    return 'Moonbeam';
  }
  return 'FIN';
}

export function getChainAddressPrefix(chain: Chains) {
  if (chain === Chains.Osmosis) {
    return 'osmo';
  }
  return 'kujira';
}
export function getChainFromAddress(address: string) {
  if (address.startsWith(getChainAddressPrefix(Chains.Osmosis))) {
    return Chains.Osmosis;
  }
  if (address.startsWith(getChainAddressPrefix(Chains.Kujira))) {
    return Chains.Kujira;
  }
  return undefined;
}

export function getChainAddressLength(chain: Chains) {
  if (chain === Chains.Osmosis) {
    return 43;
  }
  return 45;
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
  name: Chains;
  chainType: ChainType;
  contractAddress: string;
  feeTakerAddress: string;
  autoCompoundStakingRewardsAddress: string;
};

export function getChainConfig(chain: Chains) {
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
