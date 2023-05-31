import type { AppProps } from 'next/app';
import '@fontsource/karla';
import { ReactElement, ReactNode, useEffect } from 'react';
import type { NextPage } from 'next';
import * as amplitude from '@amplitude/analytics-browser';
import theme from 'src/theme';
import { Center, ChakraProvider, Heading, Image, Text } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CalcWalletModalProvider } from '@components/WalletModalProvider';
import Head from 'next/head';
import { featureFlags, HOTJAR_SITE_ID } from 'src/constants';
import { hotjar } from 'react-hotjar';
import { useKujira } from '@hooks/useKujira';
import { useStation } from '@hooks/useStation';
import { useKeplr } from '@hooks/useKeplr';
import { useChain } from '@hooks/useChain';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useOsmosis } from '@hooks/useOsmosis';
import * as Sentry from '@sentry/react';
import { isMainnet } from '@utils/isMainnet';
import { AssetListWrapper } from '@hooks/useCachedAssetList';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// disable retries on testnet
const queryClient = new QueryClient();

Sentry.init({
  dsn: 'https://c9fd7738c4244fbba9ece76de612785b@o4505139619364864.ingest.sentry.io/4505140076281856',
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  environment: isMainnet() ? 'production' : 'test',
});

function initAmplitude() {
  if (featureFlags.amplitudeEnabled) {
    amplitude.init('6c73f6d252d959716850893db0164c57', undefined, {
      defaultTracking: { sessions: true, pageViews: true, formInteractions: true, fileDownloads: true },
    });
  }
}

initAmplitude();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useEffect(() => {
    if (HOTJAR_SITE_ID) {
      hotjar.initialize(parseInt(HOTJAR_SITE_ID, 10), 0);
    }
  });

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
        <Sentry.ErrorBoundary
          fallback={
            <Center m={8} layerStyle="panel" p={8} flexDirection="column" gap={6}>
              <Heading size="lg">Something went wrong</Heading>
              <Image w={28} h={28} src="/images/notConnected.png" />
              <Text>Please try again in a new session</Text>
            </Center>
          }
        >
          <CalcWalletModalProvider>
            <QueryClientProvider client={queryClient}>
              <AssetListWrapper>{getLayout(<Component {...pageProps} />)}</AssetListWrapper>
            </QueryClientProvider>
          </CalcWalletModalProvider>
        </Sentry.ErrorBoundary>
      </ChakraProvider>
    </>
  );
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default MyApp;
