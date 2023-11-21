import { ChildrenProp } from '@helpers/ChildrenProp';
import { ChainProvider as CosmosKitChainProvider } from '@cosmos-kit/react';
import { assets, chains } from 'chain-registry';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import { wallets as xdefiWallets } from '@cosmos-kit/xdefi';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { SignerOptions } from '@cosmos-kit/core';
import { isMobile } from 'react-device-detect';

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
      wallets={[...leapWallets, ...keplrWallets, ...xdefiWallets].filter((wallet) =>
        isMobile ? !wallet.isModeExtension : wallet.isModeExtension,
      )}
      signerOptions={signerOptions}
      endpointOptions={{
        isLazy: !(process.env.NODE_ENV === 'production'),
        endpoints: {
          kujira: {
            rpc: ['https://kujira-rpc.nodes.defiantlabs.net', 'https://rpc-kujira.mintthemoon.xyz'],
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
      walletConnectOptions={{
        signClient: {
          projectId: '50fa0187387c8c2f72d360c6ba9f3333',
          relayUrl: 'wss://relay.walletconnect.org',
          metadata: {
            name: 'Calculated Finance',
            description: 'Calculated Finance',
            icons: [],
            url: 'https://app.calculated.fi',
          },
        },
      }}
    >
      {children}
    </CosmosKitChainProvider>
  );
}
