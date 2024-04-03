import {
  ReactNode,
  useEffect,
} from "react"
import * as Sentry from '@sentry/nextjs'

// entities
import { NotificationsListPooling } from "@/entities/Notification"

/*
* there is an example for one region through firebase
* import { socketAsyncInitializer } from './by-sockets-firebase-one-region-version'
* */
const socketAsyncInitializer__mock = () => {
  console.warn(
    'There is a Mock function, you should rewrite sockets function by multi regions. See more in `by-sockets-firebase-one-region-version.ts`'
  )
  Sentry.captureMessage(
    'You have activated an unnecessary mock function `socketAsyncInitializer__mock`. Please switch env var `NEXT_PUBLIC_ENABLE_NOTIFICATIONS_PROVIDER_BY_SOCKETS` to `false` value. Or write for supporting multi-regions sockets connection on frontend. Backend already has this functional.'
  )
}

export type NotificationProps = {
  children: ReactNode
}

const isSocketsEnable: boolean = Boolean(process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS_PROVIDER_BY_SOCKETS === "true")

const useEffectCallbackForSockets = () => {
  socketAsyncInitializer__mock()

  return () => {
    console.log('NotificationProvider powered by useEffectCallbackForSockets was unmount')
  }
}

const useEffectCallbackForPolling = () => {
  const TTL_DELAY_TO_START_POOLING_NOTIFICATIONS_MS = 5000 as const
  const TTL_POOLING_NOTIFICATIONS_MS = 10000 as const

  let intervalId: NodeJS.Timeout | null = null
  const timeoutId = setTimeout(() => {
    intervalId = setInterval(async () => {
      NotificationsListPooling.poolingNewCargosForUser()
    }, TTL_POOLING_NOTIFICATIONS_MS)
  }, TTL_DELAY_TO_START_POOLING_NOTIFICATIONS_MS)

  return () => {
    if (timeoutId) clearTimeout(timeoutId)
    if (intervalId) clearInterval(intervalId)
  }
}

const useEffectCallback = isSocketsEnable
  ? useEffectCallbackForSockets
  : useEffectCallbackForPolling

export function NotificationProvider({ children }: NotificationProps) {
  // useEffect(useEffectCallback, [])

  return (
    <>{children}</>
  )
}
