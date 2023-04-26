import { GasPrice } from '@cosmjs/stargate';
import { Chains } from '@hooks/useChain';
import { ChainInfo } from '@keplr-wallet/types';
import { isMainnet } from '@utils/isMainnet';
import { CHAIN_INFO } from 'kujira.js';
import {
  CHAIN_ID,
  CONTRACT_ADDRESS,
  FEE_TAKER_ADDRESS,
  RPC_ENDPOINT,
  STAKING_ROUTER_CONTRACT_ADDRESS,
} from 'src/constants';

const osmoTestnetConfig = {
  chainId: 'osmo-test-5',
  chainName: 'Osmosis Testnet 5',
  rpc: 'https://osmosis-testnet-rpc.polkachu.com/',
  rest: 'https://lcd-test.osmosis.zone',
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
      return osmoTestnetConfig;
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
      return 'osmo1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6sz3zukw';
    }
    return 'osmo1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6sz3zukw';
  }

  return CONTRACT_ADDRESS;
}

export function getChainFeeTakerAddress(chain: Chains) {
  if (chain === Chains.Osmosis) {
    if (isMainnet()) {
      return 'osmo16q6jpx7ns0ugwghqay73uxd5aq30du3uemhp54';
    }
    return 'osmo16q6jpx7ns0ugwghqay73uxd5aq30du3uemhp54';
  }

  return FEE_TAKER_ADDRESS;
}

export function getChainStakingRouterContractAddress(chain: Chains) {
  if (chain === Chains.Osmosis) {
    return getChainContractAddress(chain);
  }

  return STAKING_ROUTER_CONTRACT_ADDRESS;
}

export function getChainId(chain: Chains) {
  if (chain === Chains.Osmosis) {
    if (isMainnet()) {
      return 'osmo-test-4';
    }
    return 'osmo-test-4';
  }
  return CHAIN_ID;
}

export function getChainDexName(chain: Chains) {
  if (chain === Chains.Osmosis) {
    return 'Osmosis';
  }
  return 'FIN';
}

export function getChainAddressPrefix(chain: Chains) {
  if (chain === Chains.Osmosis) {
    return 'osmo';
  }
  return 'kujira';
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

export function getMarsAddress() {
  return isMainnet()
    ? 'osmo1c3ljch9dfw5kf52nfwpxd2zmj2ese7agnx0p9tenkrryasrle5sqf3ftpg'
    : 'osmo1e9awnhgz8v2vmyx2yrquudfsany687mtn8zdyn255fn7k982h8wqm4t3gp';
}

export function getMarsUrl() {
  return isMainnet() ? 'https://mars.osmosis.zone' : 'https://testnet-osmosis.marsprotocol.io/';
}
