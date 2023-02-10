import '@/styles/globals.scss'
import React, { ReactElement, ReactNode } from "react"
import { NextPage } from "next"
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import themes from '@/lib/themes'
import { AuthProvider } from '@/lib/auth'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page)

  const customization = {
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: '0'
  }

  return (
    <ThemeProvider theme={themes(customization)}>
      <AuthProvider>
        {getLayout(<Component {...pageProps} />)}
      </AuthProvider>
    </ThemeProvider>
  )
}
