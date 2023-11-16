import { ChildrenProp } from '@helpers/ChildrenProp';
import { ChainProvider as CosmosKitChainProvider, useChain } from '@cosmos-kit/react';
import { assets, chains } from 'chain-registry';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import { wallets as xdefiWallets } from '@cosmos-kit/xdefi';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { SignerOptions } from '@cosmos-kit/core';
import { filter } from 'rambda';
import { useChainId } from '@hooks/useChain';

export const signerOptions: SignerOptions = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  signingCosmwasm: (chain: Chain) => {
    const denom = {
      'kaiyo-1': 'ukuji',
      'harpoon-4': 'ukuji',
      'osmosis-1': 'uosmo',
      'osmo-test-5': 'uosmo',
    }[chain.chain_id as string];

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
      endpointOptions={{
        isLazy: true,
        endpoints: {
          kujira: {
            rpc: ['https://rpc-kujira.mintthemoon.xyz'],
          },
          osmosis: {
            rpc: ['https://rpc.osmosis.zone/'],
          },
          kujiratestnet: {
            rpc: ['https://kujira-testnet-rpc.polkachu.com/'],
          },
          osmosistestnet: {
            rpc: ['https://rpc.osmotest5.osmosis.zone/'],
          },
        },
      }}
      modalTheme={{ defaultTheme: 'dark' }}
    >
      {children}
    </CosmosKitChainProvider>
  );
}
