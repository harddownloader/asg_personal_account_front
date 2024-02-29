import { memo } from 'react'
import { Grid, Typography } from "@mui/material"

// types
import { TTitle } from "@/widgets/CargosBlock/CargosInfo/CargoInfo"

export interface ITitleProps {
  title: TTitle
}

export const Title = memo(({ title }: ITitleProps) => {
  return (
    <>
      {title && <Grid item xs={12}>
        <Grid container alignContent="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4">{title}</Typography>
          </Grid>
          <Grid item></Grid>
        </Grid>
      </Grid>}
    </>
  )
})
