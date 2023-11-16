import type { AppProps } from 'next/app';
import '@fontsource/karla';
import { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import theme from 'src/theme';
import { Center, ChakraProvider, Heading, Image, Text } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { CalcWalletModalProvider } from '@components/WalletModalProvider';
import Head from 'next/head';
import { useChainId } from '@hooks/useChain';
import * as Sentry from '@sentry/react';
import { isMainnet } from '@utils/isMainnet';
import { AssetListWrapper } from '@hooks/useCachedAssetList';
import { useAssetList } from '@hooks/useAssetList';
import { ChainId } from '@hooks/useChain/Chains';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { useMetamask } from '@hooks/useMetamask';
import { ToastContainer } from './toast';
import { queryClient } from './queryClient';
import { ChainWrapper } from './ChainWrapper';
import { InitWrapper } from './InitWrapper';
import { LoadingState } from './LoadingState';
import '@interchain-ui/react/styles';
import { ChainProvider } from './ChainProvider';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

Sentry.init({
  dsn: 'https://c9fd7738c4244fbba9ece76de612785b@o4505139619364864.ingest.sentry.io/4505140076281856',
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  // Performance Monitoring
  tracesSampleRate: 0.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  environment: 'production',
  enabled: isMainnet(),
});

function AssetListLoader({ children }: ChildrenProp) {
  const { data: assetList } = useAssetList();

  const { chainId: chain } = useChainId();

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return !['osmosis-1', 'osmo-test-5'].includes(chain) || assetList ? <>{children}</> : <LoadingState />;
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const { chainId: chain } = useChainId();

  return (
    <>
      <Head>
        <title>CALC - Calculated Finance</title>
      </Head>
      <ChakraProvider theme={theme}>
        <Sentry.ErrorBoundary
          beforeCapture={(scope) => {
            scope.setTag('location', 'error boundary');
            scope.setTag('chain', chain);
          }}
          fallback={
            <Center m={8} layerStyle="panel" p={8} flexDirection="column" gap={6}>
              <Heading size="lg">Something went wrong</Heading>
              <Image w={28} h={28} src="/images/notConnected.png" />
              <Text>Please try again in a new session</Text>
            </Center>
          }
        >
          <ChainWrapper>
            <ChainProvider>
              <CalcWalletModalProvider>
                <QueryClientProvider client={queryClient}>
                  <AssetListWrapper>
                    <AssetListLoader>{getLayout(<Component {...pageProps} />)}</AssetListLoader>
                  </AssetListWrapper>
                </QueryClientProvider>
              </CalcWalletModalProvider>
              <ToastContainer />
            </ChainProvider>
          </ChainWrapper>
        </Sentry.ErrorBoundary>
      </ChakraProvider>
    </>
  );
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default MyApp;
