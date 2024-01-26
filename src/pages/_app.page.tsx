import type { AppProps } from 'next/app';
import '@fontsource/karla';
import { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import theme from 'src/theme';
import { Center, ChakraProvider, Heading, Image, Text } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import Head from 'next/head';
import { useChainId } from '@hooks/useChainId';
import * as Sentry from '@sentry/react';
import { ChildrenProp } from '@helpers/ChildrenProp';
import useDenoms from '@hooks/useDenoms';
import '@interchain-ui/react/styles';
import { AgreementAcceptanceDetector } from '@components/AgreementAcceptanceDetector';
import { ToastContainer } from '@components/ToastContainer';
import { LoadingState } from '@components/LoadingState';
import { ChainProvider } from '@components/ChainProvider';
import { InitWrapper } from '@components/InitWrapper';
import { queryClient } from './queryClient';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

Sentry.init({
  dsn: 'https://c9fd7738c4244fbba9ece76de612785b@o4505139619364864.ingest.sentry.io/4505140076281856',
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  // Performance Monitoring
  tracesSampleRate: 0.01,
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  environment: process.env.NODE_ENV,
  enabled: process.env.NEXT_PUBLIC_APP_ENV === 'production',
});

function AssetListLoader({ children }: ChildrenProp) {
  const { isSuccess } = useDenoms();
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return isSuccess ? <>{children}</> : <LoadingState />;
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const { chainId } = useChainId();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>CALC - Calculated Finance</title>
      </Head>
      <ChakraProvider theme={theme}>
        <Sentry.ErrorBoundary
          beforeCapture={(scope) => {
            scope.setTag('location', 'error boundary');
            scope.setTag('chain', chainId);
          }}
          fallback={
            <Center m={8} layerStyle="panel" p={8} flexDirection="column" gap={6}>
              <Heading size="lg">Something went wrong</Heading>
              <Image w={28} h={28} src="/images/notConnected.png" />
              <Text>Please try again in a new session</Text>
            </Center>
          }
        >
          <InitWrapper>
            <ChainProvider>
              <QueryClientProvider client={queryClient}>
                <AssetListLoader>{getLayout(<Component {...pageProps} />)}</AssetListLoader>
                <AgreementAcceptanceDetector />
              </QueryClientProvider>
              <ToastContainer />
            </ChainProvider>
          </InitWrapper>
        </Sentry.ErrorBoundary>
      </ChakraProvider>
    </>
  );
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default MyApp;
