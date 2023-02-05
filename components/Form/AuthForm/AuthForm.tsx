import React, { Fragment, ReactNode } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import { fixMeInTheFuture } from "@/lib/types"

export type AuthFormProps = {
  submitBtnText: string,
  handleSubmit: fixMeInTheFuture
  fields: Array<ReactNode>,
  UnderTheButton?: ReactNode,
}

export const AuthForm = ({
                           submitBtnText,
                           handleSubmit,
                           fields,
                           UnderTheButton,
                         }: AuthFormProps) => {
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
          <img
            src="/img/logo/logo.png"
            alt="logo"
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
            <Button
              type="submit"
              fullWidth
              className={"bg-brand border-solid border border-white text-white font-bold rounded h-14 mt-4 hover:text-brand hover:bg-white hover:border-brand"}
            >
              {submitBtnText}
            </Button>
            {UnderTheButton && UnderTheButton}
          </Box>
        </Box>

      </Container>
    </>
  )
}

export default AuthForm
