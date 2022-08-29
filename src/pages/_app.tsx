import type { AppProps } from 'next/app'
import '@fontsource/karla'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <Component {...pageProps} />
  )
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}



export default MyApp
