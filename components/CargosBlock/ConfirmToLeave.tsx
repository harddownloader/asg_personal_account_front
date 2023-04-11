/* eslint react/display-name: 0 */
/* eslint react-hooks/rules-of-hooks: 0 */

import React, {
  useState,
} from 'react'

// mui
import Button from "@mui/material/Button"
import { Grid } from "@mui/material"

// project components
import DialogHOC from "../Dialog/Modal/DialogHOC"

export interface ConfirmToLeaveProps {

}

type successFuncType = () => void
type successFuncObjType = {
  function?: successFuncType
}

export const ConfirmToLeave = (Component: typeof React.Component) => ({ ...props }: ConfirmToLeaveProps) => {
  const [isShow, setIsShow] = useState(false)

  const [successFuncObj, setSuccessFuncObj] = useState<successFuncObjType>({})

  const check = () => {}

  const show = () => {
    setIsShow(true)
  }

  const hide = () => {
    setIsShow(false)
  }

  const successHandle = () => {
    hide()

    const func = successFuncObj as successFuncObjType
    if (func?.function && typeof func.function === 'function') {
      func.function()
    }
  }

  const showConfirmToLeave = (successFunc: successFuncType, cancelFunc: () => void) => {
    show()

    if (!successFunc) return

    setSuccessFuncObj({ function: successFunc })
  }


  return (
    <>
      <Component {...(props as any)} showConfirmToLeave={showConfirmToLeave} />
      {
        isShow && <DialogHOC
          isVisible={isShow}
          isMobileVersion={false}
          title={'Прервать загрузку?'}
          handleClose={hide}
          confirm={null}
          childrenFooter={
            <>
              <Grid item lg={6} md={6} sm={6} xs={6}>
                <Button
                  className={"w-full bg-white border-solid border border-brand text-brand font-bold rounded h-14 mt-4 hover:text-white hover:bg-brand"}
                  onClick={(e) => successHandle()}
                >
                  Да, прервать
                </Button>
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={6}>
                <Button
                  className={"w-full bg-white border-solid border border-brand text-brand font-bold rounded h-14 mt-4 hover:text-white hover:bg-brand"}
                  onClick={(e) => hide()}
                >
                  Нет
                </Button>
              </Grid>
            </>
          }
          maxWidth={'md'}
        >
          <p>Сейчас идет загрузка файлов, вы уверены, что хотите прервать загрузку?</p>
        </DialogHOC>
      }
    </>
  )
}

export default ConfirmToLeave
