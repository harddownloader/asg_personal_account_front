import {Fragment} from "react"
import {useTheme} from "@mui/material/styles"
import {List} from "@mui/material"

// components
import {RegionListItem} from "./RegionListItem"

// entities
import {IRegion} from "@/entities/Region"

// shared
import {ICustomTheme} from "@/shared/lib/themes/theme"


export interface IRegionListProps {
  regions: IRegion[]
}

export const RegionList = ({ regions }: IRegionListProps) => {
  const theme = useTheme<ICustomTheme>()

  const chipSX = {
    height: 24,
    padding: '0 6px'
  }

  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.orange.light,
    marginRight: '5px'
  }

  const chipWarningSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.warning.light
  }

  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    height: 28
  }

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 22
        },
        '& .MuiDivider-root': {
          my: 0
        },
        '& .list-container': {
          pl: 7
        }
      }}
    >
      {
        (Array.isArray(regions) && regions.length)
          ? regions.map((region, index) => (
            <Fragment key={index}>
              <RegionListItem
                region={region}
              />
            </Fragment>
          ))
          : <p className={"p-8 text-xs"}>Нет регионов</p>
      }
    </List>
  )
}
