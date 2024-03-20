/* eslint react-hooks/exhaustive-deps: 0 */
import React, { ReactElement, useEffect } from "react"
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import Router from "next/router"
import nookies from "nookies"
import * as Sentry from '@sentry/nextjs'
import { observer } from "mobx-react-lite"

// widgets
import { AccountLayout } from "@/widgets/Layout"
import { CargosBlock } from "@/widgets/CargosBlock/CargosBlock"

// shared
import { ACCESS_TOKEN_KEY } from "@/shared/lib/providers/auth"
import { pagesPath } from "@/shared/lib/$path"
import { isTokenExpire, parseJwtOnServer } from "@/shared/lib/token"
import { Preloader } from "@/shared/ui/Preloader"

// entities
import {
  // const
  USER_ROLE,

  // types
  IUserOfDB,
  TDecodedAccessToken,

  // api
  getAllClients,
  getMe,

  // api mappers
  mapUserDataFromApi,

  // stores
  UserStore,
  ClientsStore, TUserCountry,
} from "@/entities/User"
import {
  // api
  getAllByUserId,

  // store
  NotificationsStore,
} from "@/entities/Notification"
import {
  // api
  getAllCargos,
  getCargosByUserId,

  // store
  CargosListView,
  CargosStore,
} from "@/entities/Cargo"
import {
  // api
  getTones,
  getTonesByUserId,

  // store
  ToneStore
} from "@/entities/Tone"
import {
  // const
  REGION_KEY,

  // store
  RegionsStore
} from "@/entities/Region"

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
    const region = cookies[REGION_KEY]
    console.log({ cookies, region })

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
    const isAdmin = currentUser.role === USER_ROLE.ADMIN

    const getRegion = () => isAdmin ? region : country
    const currentRegion = getRegion()

    console.time('home_page_all_requests_benchmark')

    const emptyPromise = async () => null
    const promises = []
    const notificationsPromiseIndex = 0
    promises[notificationsPromiseIndex] = async () => await getAllByUserId({
      userId,
      country: currentRegion,
      token: accessToken,
    })

    const clientsPromiseIndex = 1
    promises[clientsPromiseIndex] = async () => isUserEmployee
      ? await getAllClients({ country: currentRegion, token: accessToken })
      : await emptyPromise()

    const cargosPromiseIndex = 2
    promises[cargosPromiseIndex] = async () => isUserEmployee
      ? await getAllCargos({
        country: currentRegion,
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
          country: currentRegion,
          token: accessToken,
        })
      : await getTonesByUserId({
        country: currentRegion,
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
        region: currentRegion,
        currentTime: new Date().toString() // region change marker
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
                 region,
                 currentTime, // region change marker
               }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
    initStores()
  }, [])

  useEffect(() => {
    initStores()
  }, [currentTime])

  const initStores = () => {
    if (region) RegionsStore.setCurrentItem({ name: region })

    CargosStore.setList(cargos?.length ? cargos : [])

    if (!UserStore.user.currentUser.id) UserStore.saveUserToStore(mapUserDataFromApi({...currentUser}))

    if (clients === null) ClientsStore.setCurrentItem({...currentUser})
    else ClientsStore.initClientsLists(clients?.length ? clients : [])

    NotificationsStore.setList(notifications?.length ? notifications : [])

    ToneStore.setList(tones?.length ? tones : [])

    // set view cargos list
    CargosListView.archiveItemsToggle(false)
  }

  // set a loader when we change regions
  Router.events.on("routeChangeStart", () => RegionsStore.setLoading(true))
  Router.events.on("routeChangeComplete", () => RegionsStore.setLoading(false))
  Router.events.on("routeChangeError", () => () => RegionsStore.setLoading(false))
  const isLoading = RegionsStore.regions.isLoading

  return (
    <>
      { isLoading ? <Preloader /> : <CargosBlock /> }
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>
}


const HomePage = observer(Home)

HomePage.displayName = 'Home'
export default HomePage
