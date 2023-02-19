import React from "react"

// mui
import Button from "@mui/material/Button"

// project components
import { Preloader } from "@/components/ui-component/Preloader"

export interface SubmitButton {
  isLoading: boolean
  text: string
}

export const SubmitButton = ({ isLoading, text }: SubmitButton) => {
  return (
    <>
      <Button
        type="submit"
        fullWidth
        disabled={isLoading}
        className={"bg-brand border-solid border border-white !text-white font-bold rounded h-14 mt-4 hover:!text-brand hover:bg-white hover:border-brand"}
      >
        { isLoading ? <Preloader /> : text }
      </Button>
    </>
  )
}

export default SubmitButton