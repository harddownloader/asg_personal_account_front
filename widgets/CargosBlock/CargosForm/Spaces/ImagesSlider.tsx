import { Fragment } from 'react'
import Image from "next/image"

// mui
import { Grid } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

// shared
import { GRID_SPACING } from "@/shared/const"

export interface ImagesSliderProps {
  handlerDelete: ((index: number) => void | any) | undefined
  urls: Array<string>
  isCurrentUserManager: boolean
}

export const ImagesSlider = ({
                               handlerDelete,
                               urls,
                               isCurrentUserManager,
                             }: ImagesSliderProps) => {

  return (
    <>
      <Grid container spacing={GRID_SPACING}>
        {urls.map((url, index) => (
          <Fragment key={`${url}-${index}`}>
            <Grid item lg={4} md={4} sm={6} xs={12}>
              <div className="w-full max-h-52	bg-brand relative hover:grayscale-[0.6]">
                {isCurrentUserManager && <button
                  className={"absolute top-0 right-0 text-white w-6 h-6 bg-black"}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlerDelete && handlerDelete(index)
                  }}
                >
                  <CloseIcon
                    className={"text-white"}
                  />
                </button>}
                <div className={"unset-img"}>
                  <Image
                    src={url}
                    alt={"uploaded"}
                    className={"custom-img"}
                    fill
                    sizes="(max-width: 768px) 100vw,
                          (max-width: 1200px) 50vw,
                          33vw"
                  />
                </div>
              </div>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </>
  )
}
