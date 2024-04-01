import { ReactElement, useEffect } from "react"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import nookies from "nookies"
import * as Sentry from "@sentry/nextjs"

// widgets
import { AuthLayout } from "@/widgets/Layout/AuthLayout/AuthLayout"
import { FooterMemoized } from "@/widgets/Footer"
import { LoginSection } from "@/widgets/LoginSection"

// shared
import { ACCESS_TOKEN_KEY } from "@/shared/lib/providers/auth"
import { isTokenExpire, parseJwtOnServer } from "@/shared/lib/token"
import { pagesPath } from "@/shared/lib/$path"
import { destroyAccessToken } from "@/shared/lib/cookies"

// entities
import {
  // store
  UserStore,

  // types
  IUserOfDB,

  // api
  getMe,
} from "@/entities/User"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx)

    const accessToken = cookies[ACCESS_TOKEN_KEY]
    const decodedJwt = await parseJwtOnServer(accessToken)
    if (isTokenExpire(decodedJwt)) return {
      props: {} as never,
    }

    const countryByToken = decodedJwt.claims.country
    const userIdByToken = decodedJwt.claims.id
    const currentUser: IUserOfDB | null = await getMe({
      userId: userIdByToken,
      country: countryByToken,
      token: accessToken
    })

    return {
      redirect: {
        permanent: false,
        destination: pagesPath.home.$url().pathname,
      },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {} as never,
    }
  } catch (err) {
    return {
      props: {} as never,
    }
  }
}

export function LoginPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
    clearPrevSession()
  }, [])

  const clearPrevSession = async () => {
    destroyAccessToken()
    await UserStore.logout()
  }

  return (
    <>
      <div className={"h-screen flex justify-center items-center"}>
        <div className={"h-full flex flex-col"}>
          <div className={"flex-[0.1]"}>
            <div></div>
          </div>

          <LoginSection />

          <FooterMemoized />
        </div>
      </div>
    </>
  )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default LoginPage

