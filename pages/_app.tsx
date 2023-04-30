import '@/styles/globals.scss'
import React, { ReactElement, ReactNode } from "react"
import { NextPage } from "next"
import type { AppProps } from 'next/app'
import {
  StyledEngineProvider,
  ThemeProvider
} from '@mui/material/styles'
import { theme, customization } from '@/lib/themes'
import { AudioProvider } from "@/lib/audio"

// providers
import { AuthProvider } from '@/lib/providers/auth'
import { NotificationProvider } from '@/lib/providers/notification'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page)

  /*
  * <StyledEngineProvider injectFirst>
  * https://github.com/vercel/next.js/discussions/32565
  * */
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme(customization)}>
        <AuthProvider>
          <AudioProvider>
            <NotificationProvider>
              {getLayout(<Component {...pageProps} />)}
            </NotificationProvider>
          </AudioProvider>
        </AuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
