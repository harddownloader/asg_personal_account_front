import { useRouter } from "next/navigation"
import { observer } from "mobx-react-lite"

// mui
import {
  Grid,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  List,
  ListItemButton,
  ListItemIcon
} from "@mui/material"

// entities
import { IRegion, RegionsStore } from "@/entities/Region"
import { getCountryFlagImage, setRegionCookie } from "@/entities/Region/lib"
import { CargosStore } from "@/entities/Cargo"
import { ToneStore } from "@/entities/Tone"
import { NotificationsStore } from "@/entities/Notification"
import { ClientsStore } from "@/entities/User"

// shared
import { pagesPath } from "@/shared/lib/$path"



export interface IRegionListItemProps {
  region: IRegion
  isActive: boolean
}

export const RegionListItem = observer(({ region, isActive }: IRegionListItemProps) => {
  const router = useRouter()

  const onClickHandler = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    await RegionsStore.setCurrentItem(region)
    await setRegionCookie(region.name)
    // clear cargos
    CargosStore.clearAll()

    // clear clients
    ClientsStore.clearAll()

    // clear tones
    ToneStore.clearAll()

    // clear notifications
    NotificationsStore.clearAll()

    await router.replace(pagesPath.home.$url().pathname)
  }

  return (
    <>
      <List>
        <ListItem alignItems="center">
          <ListItemButton
            disabled={RegionsStore.regions.isLoading}
            onClick={onClickHandler}
            selected={isActive}
            sx={{
              '&&.Mui-selected .MuiListItemText-primary, &&:hover .MuiListItemText-primary': {
                color: '#fff'
              },
            }}
            component={'div'}
          >
            <ListItemIcon>
              {getCountryFlagImage({
                countryShortname: region.name,
                width: 15,
                height: 15
              })}
            </ListItemIcon>
            <ListItemText primary={region.name.toUpperCase()} />
            <ListItemSecondaryAction>
              <Grid container justifyContent="flex-end">
                <Grid item>
                </Grid>
              </Grid>
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
      </List>
    </>
  )
})
