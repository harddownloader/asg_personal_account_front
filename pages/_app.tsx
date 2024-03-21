import { ReactElement, ReactNode } from "react"
import { NextPage } from "next"
import type { AppProps } from 'next/app'

// mui
import {
  StyledEngineProvider,
  ThemeProvider
} from '@mui/material/styles'

// shared
import { theme, customization } from '@/shared/lib/themes'
import { AudioProvider } from "@/shared/lib/audio"

// providers
import { AuthProvider } from '@/shared/lib/providers/auth'
import { NotificationProvider } from '@/entities/Notification'

// assets
import '@/shared/styles/globals.scss'

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
