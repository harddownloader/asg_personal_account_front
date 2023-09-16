import React, { ReactElement } from "react"
import { GetServerSidePropsContext } from "next"
import nookies from "nookies"
import * as Sentry from "@sentry/nextjs"
// flags select
import 'react-phone-number-input/style.css'
// @ts-ignore
import ru from 'react-phone-number-input/locale/ru'

// widgets
import { AuthLayout } from "@/widgets/Layout"
import { FooterMemoized } from "@/widgets/Footer"
import { Registration } from "@/widgets/Registration"

// shared
import { ACCESS_TOKEN_KEY, AUTHORIZATION_HEADER_KEY } from "@/shared/lib/providers/auth"
import { parseJwtOnServer } from "@/shared/lib/token"
import { API_URI } from "@/shared/const"
import { pagesPath } from "@/shared/lib/$path"

// entities
import type { IUserOfDB } from "@/entities/User"
import { getMe } from "@/entities/User"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx)

    const accessToken = cookies[ACCESS_TOKEN_KEY]
    const userByToken = await parseJwtOnServer(accessToken)
    const countryByToken = userByToken.claims.country
    const userIdByToken = userByToken.claims.id
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
    console.error(`Registration error: ${err}`)

    return {
      props: {} as never,
    }
  }
}

function RegistrationPage() {
  return (
    <>
      <div className={"h-screen flex justify-center items-center"}>
        <div className={"h-full flex flex-col"}>
          <div className={"flex-[0.1]"}>
            <div></div>
          </div>

          <Registration />

          <FooterMemoized />
        </div>
      </div>
    </>
  )
}

RegistrationPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default RegistrationPage
