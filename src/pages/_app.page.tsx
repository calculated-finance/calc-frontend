import type { AppProps } from 'next/app';
import '@fontsource/karla';
import { ReactElement, ReactNode, useEffect } from 'react';
import type { NextPage } from 'next';
import theme from 'src/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CalcWalletModalProvider } from '@components/WalletModalProvider';
import Head from 'next/head';
import { featureFlags, HOTJAR_SITE_ID, ETH_DCA_FACTORY_CONTRACT_ADDRESS } from 'src/constants';
import { hotjar } from 'react-hotjar';
import { useKujira } from '@hooks/useKujira';
import { useStation } from '@hooks/useStation';
import { useKeplr } from '@hooks/useKeplr';
import { useChain } from '@hooks/useChain';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useOsmosis } from '@hooks/useOsmosis';
import { useState } from 'react';
import { ethers } from 'ethers'

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  const getLayout = Component.getLayout ?? ((page) => page);

  const initStation = useStation((state) => state.init);

  const initKujira = useKujira((state) => state.init);
  const initOsmosis = useOsmosis((state) => state.init);
  const initKeplr = useKeplr((state) => state.init);

  const initCosmWasmClient = useCosmWasmClient((state) => state.init);

  const { chain } = useChain();

  useEffect(() => {
    if (featureFlags.stationEnabled) {
      if (chain) {
        initStation();
      }
    }
  }, [initStation, chain]);

  useEffect(() => {
    if (chain) {
      initKeplr(chain);
    }
  }, [initKeplr, chain]);

  useEffect(() => {
    if (chain) {
      initKujira(chain);
    }
  }, [initKujira, chain]);

  useEffect(() => {
    if (chain) {
      initOsmosis(chain);
    }
  }, [initOsmosis, chain]);

  useEffect(() => {
    if (chain) {
      initCosmWasmClient(chain);
    }
  }, [initCosmWasmClient, chain]);

  return (
    <>
      <Head>
        <title>CALC - Calculated Finance</title>
      </Head>
      <ChakraProvider theme={theme}>
        <CalcWalletModalProvider>
          <QueryClientProvider client={queryClient}>{getLayout(<Component {...pageProps} />)}</QueryClientProvider>
        </CalcWalletModalProvider>
      </ChakraProvider>
    </>
  );
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default MyApp;
