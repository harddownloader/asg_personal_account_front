import React, { MouseEventHandler } from 'react'
import Button from "@mui/material/Button"
import CloseIcon from "@mui/icons-material/Close"

export interface CloseSpaceBtnProps {
  isCurrentUserManager: boolean
  onClickHandler: MouseEventHandler
}

export const CloseSpaceBtn = ({
                         isCurrentUserManager,
                         onClickHandler,
                       }: CloseSpaceBtnProps) => {
  return (
    <>
      {isCurrentUserManager && <Button
        onClick={onClickHandler}
        className={"min-w-fit"}
      >
        <CloseIcon
          className={"text-brand"}
        />
      </Button>}
    </>
  )
}

export default CloseSpaceBtn
