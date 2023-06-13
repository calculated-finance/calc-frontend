import type { AppProps } from 'next/app';
import '@fontsource/karla';
import * as amplitude from '@amplitude/analytics-browser';
import { ReactElement, ReactNode, useEffect } from 'react';
import type { NextPage } from 'next';
import theme from 'src/theme';
import { Center, ChakraProvider, Heading, Image, Text } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { CalcWalletModalProvider } from '@components/WalletModalProvider';
import Head from 'next/head';
import { featureFlags } from 'src/constants';
import { useKujira } from '@hooks/useKujira';
import { useKeplr } from '@hooks/useKeplr';
import { useChain } from '@hooks/useChain';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useOsmosis } from '@hooks/useOsmosis';
import * as Sentry from '@sentry/react';
import { isMainnet } from '@utils/isMainnet';
import { AssetListWrapper } from '@hooks/useCachedAssetList';
import Spinner from '@components/Spinner';
import { useLeap } from '@hooks/useLeap';
import { useXDEFI } from '@hooks/useXDEFI';
import { useAssetList } from '@hooks/useAssetList';
import { Chains } from '@hooks/useChain/Chains';
import { ToastContainer } from './toast';
import { queryClient } from './queryClient';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

Sentry.init({
  dsn: 'https://c9fd7738c4244fbba9ece76de612785b@o4505139619364864.ingest.sentry.io/4505140076281856',
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  environment: 'production',
  enabled: isMainnet(),
});

function initAmplitude() {
  if (featureFlags.amplitudeEnabled) {
    amplitude.init('6c73f6d252d959716850893db0164c57', undefined, {
      defaultTracking: { sessions: true, pageViews: true, formInteractions: true, fileDownloads: true },
    });
  }
}

function LoadingState() {
  return (
    <Center h="100vh">
      <Spinner />
    </Center>
  );
}

function LoadingWrapper({ children }: { children: ReactNode }) {
  const { chain } = useChain();

  const { data: assetList } = useAssetList();
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return chain && (chain !== Chains.Osmosis || assetList) ? <>{children}</> : <LoadingState />;
}

function InitWrapper({ children }: { children: ReactNode }) {
  const { chain } = useChain();

  // const initStation = useStation((state) => state.init);

  const initKujira = useKujira((state) => state.init);
  const initOsmosis = useOsmosis((state) => state.init);
  const initKeplr = useKeplr((state) => state.init);
  const initLeap = useLeap((state) => state.init);
  const initXDEFI = useXDEFI((state) => state.init);

  const initCosmWasmClient = useCosmWasmClient((state) => state.init);

  useEffect(() => {
    initAmplitude();
  }, []);

  // useEffect(() => {
  //   if (featureFlags.stationEnabled) {
  //     if (chain) {
  //       initStation();
  //     }
  //   }
  // }, [initStation, chain]);

  useEffect(() => {
    if (chain) {
      initKeplr(chain);
    }
  }, [initKeplr, chain]);

  useEffect(() => {
    if (chain) {
      initLeap(chain);
    }
  }, [initLeap, chain]);

  useEffect(() => {
    if (chain) {
      initXDEFI(chain);
    }
  }, [initXDEFI, chain]);

  useEffect(() => {
    if (chain) {
      initKujira();
    }
  }, [initKujira, chain]);

  useEffect(() => {
    if (chain) {
      initOsmosis();
    }
  }, [initOsmosis, chain]);

  useEffect(() => {
    if (chain) {
      initCosmWasmClient(chain);
    }
  }, [initCosmWasmClient, chain]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const { chain } = useChain();

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
          <InitWrapper>
            <CalcWalletModalProvider>
              <QueryClientProvider client={queryClient}>
                <AssetListWrapper>
                  <LoadingWrapper>{getLayout(<Component {...pageProps} />)}</LoadingWrapper>
                </AssetListWrapper>
              </QueryClientProvider>
            </CalcWalletModalProvider>
            <ToastContainer />
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
