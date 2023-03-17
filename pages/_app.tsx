import '@/styles/globals.scss'
import React, { ReactElement, ReactNode } from "react"
import { NextPage } from "next"
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import { theme, customization } from '@/lib/themes'
import { AuthProvider } from '@/lib/auth'
import { AudioProvider } from "@/lib/audio"

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page)

  return (
    <ThemeProvider theme={theme(customization)}>
      <AuthProvider>
        <AudioProvider>
          {getLayout(<Component {...pageProps} />)}
        </AudioProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
