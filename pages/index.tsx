/* eslint react-hooks/exhaustive-deps: 0 */
import { ReactElement, useEffect } from "react"
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import nookies from "nookies"
import * as Sentry from '@sentry/nextjs'

// widgets
import { AccountLayout } from "@/widgets/Layout"
import { CargosBlock } from "@/widgets/CargosBlock/CargosBlock"

// shared
import { ACCESS_TOKEN_KEY } from "@/shared/lib/providers/auth"
import { pagesPath } from "@/shared/lib/$path"
import { isTokenExpire, parseJwtOnServer } from "@/shared/lib/token"

// store
import { CargosStore } from "@/entities/Cargo"
import { UserStore } from "@/entities/User"
import { USER_ROLE } from '@/entities/User'
import type { IUserOfDB, TDecodedAccessToken } from '@/entities/User'
import { ClientsStore } from "@/entities/User"
import { NotificationsStore } from "@/entities/Notification"

// entities
import { getAllClients, mapUserDataFromApi } from "@/entities/User"
import { getAllByUserId } from "@/entities/Notification"
import { getMe } from "@/entities/User"
import { getAllCargos, getCargosByUserId } from "@/entities/Cargo"
import {getTones, getTonesByUserCargos, ToneStore} from "@/entities/Tone"
import {getTonesByUserId} from "@/entities/Tone/api/getTonesByUserId";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const redirectToLoginPage = {
    redirect: {
      permanent: false,
      destination: pagesPath.login.$url().pathname,
    },
    // `as never` is required for correct type inference
    // by InferGetServerSidePropsType below
    props: {} as never,
  }

  console.log('Home Page - getServerSideProps start...')

  try {
    // if the users is authenticated
    const cookies = nookies.get(ctx)
    const accessToken = cookies[ACCESS_TOKEN_KEY]

    if (!accessToken) {
      console.log('accessToken not found, redirecting to login page...')
      return {
        redirect: {
          permanent: false,
          destination: pagesPath.login.$url().pathname,
        },
      }
    }

    const decodedJwt: TDecodedAccessToken = await parseJwtOnServer(accessToken)
    if (isTokenExpire(decodedJwt)) return redirectToLoginPage

    const countryByToken = decodedJwt.claims.country
    const userIdByToken = decodedJwt.claims.id

    const currentUser: IUserOfDB | null = await getMe({
      userId: userIdByToken,
      country: countryByToken,
      token: accessToken
    })

    if (!currentUser) {
      console.log('current users(currentUserInDB) not found, redirecting to login page...')
      Sentry.captureMessage(
        `current users(currentUserInDB) not found, redirecting to login page... currentUser:${currentUser}`
      )
      return {
        redirect: {
          permanent: false,
          destination: pagesPath.login.$url().pathname,
        },
      }
    }
    const country = currentUser.country
    const userId = currentUser.id
    const isUserEmployee = currentUser.role > USER_ROLE.CLIENT

    console.time('home_page_all_requests_benchmark')

    const emptyPromise = async () => null
    const promises = []
    const notificationsPromiseIndex = 0
    promises[notificationsPromiseIndex] = async () => await getAllByUserId({
      userId,
      country,
      token: accessToken,
    })

    const clientsPromiseIndex = 1
    promises[clientsPromiseIndex] = async () => isUserEmployee
      ? await getAllClients({ country, token: accessToken })
      : await emptyPromise()

    const cargosPromiseIndex = 2
    promises[cargosPromiseIndex] = async () => isUserEmployee
      ? await getAllCargos({
        country,
        token: accessToken,
      })
      : currentUser?.userCodeId
        ? await getCargosByUserId({
          userId,
          country,
          token: accessToken,
        })
        : await emptyPromise()

    const tonesPromiseIndex = 3
    promises[tonesPromiseIndex] = async () => isUserEmployee
      ? await getTones({
          country,
          token: accessToken,
        })
      : await getTonesByUserId({
        country,
        token: accessToken,
        userId
      })
    const outcomes = await Promise.allSettled(promises.map(promise => promise()))

    console.timeEnd('home_page_all_requests_benchmark')

    return {
      props: {
        currentUser: {...currentUser},
        notifications: outcomes[notificationsPromiseIndex].status === "fulfilled"
          ? outcomes[notificationsPromiseIndex].value
          : [],
        clients: outcomes[clientsPromiseIndex].status === "fulfilled"
          ? outcomes[clientsPromiseIndex].value
          : [],
        cargos: outcomes[cargosPromiseIndex].status === "fulfilled"
          ? outcomes[cargosPromiseIndex].value
          : [],
        tones: outcomes[tonesPromiseIndex].status === "fulfilled"
          ? outcomes[tonesPromiseIndex].value
          : [],
      },
    }
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // throw new Error(`${err}`)

    return redirectToLoginPage
  }
}

function Home ({
                 cargos,
                 currentUser,
                 clients,
                 notifications,
                 tones,
               }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
    if (cargos?.length) CargosStore.setList(cargos)

    if (!UserStore.user.currentUser.id) UserStore.saveUserToStore(mapUserDataFromApi({...currentUser}))

    if (clients === null) ClientsStore.setCurrentItem({...currentUser})
    else if (clients?.length) ClientsStore.initClientsLists(clients)

    if (notifications?.length) NotificationsStore.setList(notifications)

    if (tones?.length) ToneStore.setList(tones)
  }, [])

  return (
    <>
      <CargosBlock />
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>
}

export default Home
