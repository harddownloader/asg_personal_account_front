import { memo, MouseEventHandler } from "react"

// mui
import { Grid, Tooltip, Typography } from "@mui/material"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import AddIcon from "@mui/icons-material/Add"

export interface IHeaderProps {
  title: string
  isCurrentUserManager: boolean
  isCurrentClientHasClientCode: boolean
  iconsColor: string
  showFiltersHandler: MouseEventHandler<SVGSVGElement>
  handleClick: MouseEventHandler<SVGSVGElement>
}

export const Head = memo(({
                       title,
                       isCurrentUserManager,
                       showFiltersHandler,
                       isCurrentClientHasClientCode,
                       handleClick,
                       iconsColor
}: IHeaderProps) => {
  return (
    <>
      <Grid item xs={12}>
        <Grid container alignContent="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4">{title}</Typography>
          </Grid>
          {isCurrentUserManager && <Grid item>
            <>
              <Tooltip title="Фильтры">
                <FilterAltIcon
                  className={'w-[1.5rem] h-[1.5rem] mx-1'}
                  sx={{
                    color: iconsColor,
                    cursor: 'pointer'
                  }}
                  aria-controls="menu-popular-card"
                  aria-haspopup="true"
                  onClick={showFiltersHandler}
                />
              </Tooltip>
              {isCurrentClientHasClientCode && <Tooltip title="Создать новый груз">
                <AddIcon
                  className={'w-[1.5rem] h-[1.5rem]'}
                  sx={{
                    // @ts-ignore
                    color: iconsColor,
                    cursor: 'pointer'
                  }}
                  aria-controls="menu-popular-card"
                  aria-haspopup="true"
                  onClick={handleClick}
                />
              </Tooltip>}
            </>
          </Grid>}
        </Grid>
      </Grid>
    </>
  )
})
