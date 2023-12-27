import { ChildrenProp } from '@helpers/ChildrenProp';
import { ChainProvider as CosmosKitChainProvider } from '@cosmos-kit/react';
import { assets, chains } from 'chain-registry';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import { wallets as xdefiWallets } from '@cosmos-kit/xdefi';
import { isMobile } from 'react-device-detect';
import {
  CHAINS,
  KUJIRA_MAINNET_RPC,
  KUJIRA_TESTNET_RPC,
  MAINNET_CHAINS,
  OSMOSIS_MAINNET_RPC,
  OSMOSIS_TESTNET_RPC,
} from 'src/constants';
import { ChainId } from '@hooks/useChainId/Chains';

export function ChainProvider({ children }: ChildrenProp) {
  return (
    <CosmosKitChainProvider
      chains={chains.filter((chain) =>
        (process.env.NEXT_PUBLIC_APP_ENV === 'production' ? MAINNET_CHAINS : CHAINS).includes(
          chain.chain_id as ChainId,
        ),
      )}
      assetLists={assets}
      wallets={[...leapWallets, ...keplrWallets, ...xdefiWallets].filter((wallet) =>
        isMobile ? !wallet.isModeExtension : wallet.isModeExtension,
      )}
      endpointOptions={{
        isLazy: true,
        endpoints: {
          kujira: {
            rpc: [KUJIRA_MAINNET_RPC],
          },
          osmosis: {
            rpc: [OSMOSIS_MAINNET_RPC],
          },
          ...(process.env.NEXT_PUBLIC_APP_ENV !== 'production'
            ? {
                kujiratestnet: {
                  rpc: [KUJIRA_TESTNET_RPC],
                },
                osmosistestnet: {
                  rpc: [OSMOSIS_TESTNET_RPC],
                },
              }
            : {}),
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
