import type { AppProps } from 'next/app';
import '@fontsource/karla';
import { ReactElement, ReactNode, useMemo } from 'react';
import type { NextPage } from 'next';
import { KeplrWalletAdapter } from '@wizard-ui/core';
import { WizardProvider } from '@wizard-ui/react';
import theme from 'src/theme';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GasPrice } from '@cosmjs/stargate';
import { CalcWalletModalProvider } from '@components/WalletModalProvider';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const endpoint = useMemo(() => 'https://rpc.harpoon.kujira.setten.io', []);
  const chainId = useMemo(() => 'harpoon-4', []);

  // const endpoint = useMemo(() => 'https://rpc.kaiyo.kujira.setten.io:443', []);
  // const chainId = useMemo(() => 'kaiyo-1', []);

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
      <WizardProvider endpoint={endpoint} wallets={wallets} chainId={chainId}>
        <CalcWalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <CSSReset />
            {getLayout(
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Component {...pageProps} />,
            )}
          </QueryClientProvider>
        </CalcWalletModalProvider>
      </WizardProvider>
    </ChakraProvider>
  );
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default MyApp;
