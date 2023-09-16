import React, { Fragment, ReactNode, useMemo } from "react"
import { observer } from "mobx-react-lite"
import Image from 'next/image'

// mui
import CssBaseline from "@mui/material/CssBaseline"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"

// shared
import { SubmitButton } from "@/shared/ui/SubmitButton/SubmitButton"
import { TFixMeInTheFuture } from "@/shared/types/types"

// store
import { UserStore } from '@/entities/User'

export type AuthFormProps = {
  submitBtnText: string,
  handleSubmit: TFixMeInTheFuture
  fields: Array<ReactNode>,
  UnderTheButton?: ReactNode,
}

export const AuthForm = observer(({
                           submitBtnText,
                           handleSubmit,
                           fields,
                           UnderTheButton,
                         }: AuthFormProps) => {
  const isLoading = useMemo(() => UserStore.user.isLoading, [UserStore.user.isLoading])

  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        className={"flex justify-center items-center"}
      >
        <CssBaseline />
        <Box
          className={'bg-brand flex flex-col items-center p-8'}
        >
          <Image
            src="/img/logo/logo.png"
            alt="logo"
            width="145"
            height="40"
            sizes="100vw"
            className={"h-10 mt-10 mb-10"}
          />
          <Box
            component="form"
            onSubmit={handleSubmit}
            className={"mt-2"}
          >
            {fields.map((field, index) => (
              <Fragment key={index}>
                {field}
              </Fragment>
            ))}
            <SubmitButton
              text={submitBtnText}
              isLoading={isLoading}
            />
            {UnderTheButton && UnderTheButton}
          </Box>
        </Box>

      </Container>
    </>
  )
})
