import type { AppProps } from 'next/app';
import '@fontsource/karla';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...pageProps} />,
  );
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default MyApp;
