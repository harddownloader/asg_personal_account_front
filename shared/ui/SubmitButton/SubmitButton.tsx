import React from "react"

// mui
import Button from "@mui/material/Button"

// shared
import { Preloader } from "@/shared/ui/Preloader"

export interface ISubmitButton {
  isLoading: boolean
  text: string
}

export const SubmitButton = ({ isLoading, text }: ISubmitButton) => {
  return (
    <>
      <Button
        type="submit"
        fullWidth
        disabled={isLoading}
        className={"bg-brand border-solid border border-white !text-white font-bold rounded h-[3.2rem] mt-4 hover:!text-brand hover:bg-white hover:border-brand"}
      >
        { isLoading ? <Preloader /> : text }
      </Button>
    </>
  )
}
