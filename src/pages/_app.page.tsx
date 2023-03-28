import type { AppProps } from 'next/app';
import '@fontsource/karla';
import { ReactElement, ReactNode, useEffect, useMemo } from 'react';
import type { NextPage } from 'next';
import { WizardProvider } from '@wizard-ui/react';
import theme from 'src/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GasPrice } from '@cosmjs/stargate';
import { CalcWalletModalProvider } from '@components/WalletModalProvider';
import { createStore, StateMachineProvider } from 'little-state-machine';
import Head from 'next/head';
import { CHAIN_ID, HOTJAR_SITE_ID, RPC_ENDPOINT } from 'src/constants';
import { hotjar } from 'react-hotjar';
import { WalletContext } from '@components/WalletProvider';
import { NetworkContext } from '@hooks/useNetwork';
import { KeplrWalletAdapter } from './keplr';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const queryClient = new QueryClient();

// can make this more dumb because maybe we can set default values with yup schemas instead

createStore({});

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useEffect(() => {
    if (HOTJAR_SITE_ID) {
      hotjar.initialize(parseInt(HOTJAR_SITE_ID, 10), 0);
    }
  });

  const getLayout = Component.getLayout ?? ((page) => page);

  const endpoint = useMemo(() => RPC_ENDPOINT, []);
  const chainId = useMemo(() => CHAIN_ID, []);

  const wallets = useMemo(
    () => [
      new KeplrWalletAdapter({
        endpoint,
        chainId,
        options: {
          gasPrice: GasPrice.fromString('0.015ukuji'),
        },
      }),
    ],
    [endpoint, chainId],
  );

  return (
    <>
      <Head>
        <title>CALC - Calculated Finance</title>
      </Head>
      <ChakraProvider theme={theme}>
        <WizardProvider endpoint={endpoint} wallets={wallets} chainId={chainId}>
          <NetworkContext>
            <WalletContext>
              <CalcWalletModalProvider>
                <QueryClientProvider client={queryClient}>
                  <StateMachineProvider>{getLayout(<Component {...pageProps} />)}</StateMachineProvider>
                </QueryClientProvider>
              </CalcWalletModalProvider>
            </WalletContext>
          </NetworkContext>
        </WizardProvider>
      </ChakraProvider>
    </>
  );
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default MyApp;
