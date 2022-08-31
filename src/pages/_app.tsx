import type { AppProps } from 'next/app';
import '@fontsource/karla';
import { ReactElement, ReactNode, useMemo } from 'react';
import type { NextPage } from 'next';
import { KeplrWalletAdapter } from '@wizard-ui/core';
import { WalletProvider, WalletModalProvider, CWClientProvider } from '@wizard-ui/react';
import theme from 'src/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GasPrice } from '@cosmjs/stargate';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const endpoint = useMemo(() => 'https://rpc-test.osmosis.zone', []);
  const chainId = useMemo(() => 'cosmoshub-4', []);

  const wallets = useMemo(
    () => [
      new KeplrWalletAdapter({
        endpoint,
        chainId,
        options: {
          gasPrice: GasPrice.fromString('0.015uosmo'),
        },
      }),
    ],
    [endpoint, chainId],
  );

  return (
    <ChakraProvider theme={theme}>
      <CWClientProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} chainId={chainId}>
          <WalletModalProvider>
            <QueryClientProvider client={queryClient}>
              {getLayout(
                // eslint-disable-next-line react/jsx-props-no-spreading
                <Component {...pageProps} />,
              )}
            </QueryClientProvider>
          </WalletModalProvider>
        </WalletProvider>
      </CWClientProvider>
    </ChakraProvider>
  );
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default MyApp;
