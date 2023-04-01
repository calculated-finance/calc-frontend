import type { AppProps } from 'next/app';
import '@fontsource/karla';
import { ReactElement, ReactNode, useEffect } from 'react';
import type { NextPage } from 'next';
import theme from 'src/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CalcWalletModalProvider } from '@components/WalletModalProvider';
import { createStore, StateMachineProvider } from 'little-state-machine';
import Head from 'next/head';
import { featureFlags, HOTJAR_SITE_ID } from 'src/constants';
import { hotjar } from 'react-hotjar';
import { useKujira } from '@hooks/useKujira';
import { useStation } from '@hooks/useStation';
import { useKeplr } from '@hooks/useKeplr';

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

  const init = useStation((state) => state.init);
  if (featureFlags.stationEnabled) {
    init();
  }

  useKujira((state) => state.init)();
  useKeplr((state) => state.init)();

  return (
    <>
      <Head>
        <title>CALC - Calculated Finance</title>
      </Head>
      <ChakraProvider theme={theme}>
        <CalcWalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <StateMachineProvider>{getLayout(<Component {...pageProps} />)}</StateMachineProvider>
          </QueryClientProvider>
        </CalcWalletModalProvider>
      </ChakraProvider>
    </>
  );
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default MyApp;
