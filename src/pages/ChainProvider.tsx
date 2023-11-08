import { ChildrenProp } from '@helpers/ChildrenProp';
import { ChainProvider as CosmosKitChainProvider } from '@cosmos-kit/react';
import { assets, chains } from 'chain-registry';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import { wallets as xdefiWallets } from '@cosmos-kit/xdefi';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { SignerOptions } from '@cosmos-kit/core';
import {
  COSMOS_KIT_KUJIRA_MAINNET,
  COSMOS_KIT_KUJIRA_TESTNET,
  COSMOS_KIT_OSMOSIS_MAINNET,
  COSMOS_KIT_OSMOSIS_TESTNET,
} from 'src/constants';
import { filter } from 'rambda';

export const signerOptions: SignerOptions = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  signingCosmwasm: (chain: Chain) => {
    const denom = {
      [COSMOS_KIT_KUJIRA_MAINNET]: 'ukuji',
      [COSMOS_KIT_KUJIRA_TESTNET]: 'ukuji',
      [COSMOS_KIT_OSMOSIS_MAINNET]: 'uosmo',
      [COSMOS_KIT_OSMOSIS_TESTNET]: 'uosmo',
    }[chain.chain_name as string];

    if (denom) {
      return {
        gasPrice: GasPrice.fromString(`0.015${denom}`),
      } as SigningCosmWasmClientOptions;
    }

    return undefined;
  },
};

export function ChainProvider({ children }: ChildrenProp) {
  return (
    <CosmosKitChainProvider
      chains={chains}
      assetLists={assets}
      wallets={filter((wallet) => wallet.isModeExtension, [...leapWallets, ...keplrWallets, ...xdefiWallets])}
      signerOptions={signerOptions}
      modalTheme={{ defaultTheme: 'dark' }}
    >
      {children}
    </CosmosKitChainProvider>
  );
}
