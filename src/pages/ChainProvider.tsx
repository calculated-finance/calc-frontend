import { ChildrenProp } from '@helpers/ChildrenProp';
import { ChainProvider as CosmosKitChainProvider } from '@cosmos-kit/react';
import { assets, chains } from 'chain-registry';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import { wallets as xdefiWallets } from '@cosmos-kit/xdefi';
import { isMobile } from 'react-device-detect';

export function ChainProvider({ children }: ChildrenProp) {
  return (
    <CosmosKitChainProvider
      chains={chains}
      assetLists={assets}
      wallets={[...leapWallets, ...keplrWallets, ...xdefiWallets].filter((wallet) =>
        isMobile ? !wallet.isModeExtension : wallet.isModeExtension,
      )}
      endpointOptions={{
        isLazy: !(process.env.NEXT_PUBLIC_APP_ENV === 'production'),
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
