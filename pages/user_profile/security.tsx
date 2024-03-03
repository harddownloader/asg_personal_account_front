import {
  ReactElement,
  useEffect,
} from "react"
import {
  InferGetServerSidePropsType,
  GetServerSidePropsContext
} from "next"
import nookies from "nookies"
import * as Sentry from "@sentry/nextjs"

// widgets
import { AccountLayout } from '@/widgets/Layout'
import { ProfileSecurity } from "@/widgets/ProfileSecurity"

// shared
import { ACCESS_TOKEN_KEY } from "@/shared/lib/providers/auth"
import { parseJwtOnServer } from "@/shared/lib/token"
import { pagesPath } from "@/shared/lib/$path"

// store
import { UserStore } from "@/entities/User"
import type { IUserOfDB } from '@/entities/User'

// entities
import { getMe, mapUserDataFromApi } from "@/entities/User"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    // if the users is authenticated
    const cookies = nookies.get(ctx)
    // console.log(JSON.stringify(cookies, null, 2))
    const accessToken = cookies[ACCESS_TOKEN_KEY]
    const userByToken = await parseJwtOnServer(accessToken)
    const countryByToken = userByToken.claims.country
    const userIdByToken = userByToken.claims.id
    const currentUser: IUserOfDB | null = await getMe({
      userId: userIdByToken,
      country: countryByToken,
      token: accessToken
    })

    if (!currentUser) return {
      redirect: {
        permanent: false,
        destination: pagesPath.home.$url().pathname,
      },
    }

    return {
      props: {
        currentUser,
      },
    }
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    console.error(`Profile security page error: ${err}`)

    return {
      redirect: {
        permanent: false,
        destination: pagesPath.login.$url().pathname,
      },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {} as never,
    }
  }
}

function ProfileSecurityPage({
                   currentUser,
                 }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
    if(!UserStore.user.currentUser.id) UserStore.saveUserToStore(mapUserDataFromApi({...currentUser}))
  })

  return (
    <>
      <ProfileSecurity currentUser={currentUser} />
    </>
  )
}

ProfileSecurityPage.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>
}

export default ProfileSecurityPage
