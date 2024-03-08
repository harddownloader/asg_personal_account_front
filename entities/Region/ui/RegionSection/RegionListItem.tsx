import {UserStore} from "@/entities/User"
import {Avatar, Grid, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography} from "@mui/material"
import {IconMailbox} from "@tabler/icons-react"
import { styled, useTheme } from "@mui/material/styles"
import {NotificationsStore} from "@/entities/Notification"
import {MouseEventHandler} from "react";
import {IRegion} from "@/entities/Region"
import {ICustomTheme} from "@/shared/lib/themes/theme"


// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: 16,
  '& .MuiListItem-root': {
    padding: 0
  }
}))

export interface IRegionListItemProps {
  region: IRegion
}

export const RegionListItem = ({ region }: IRegionListItemProps) => {
  const theme = useTheme<ICustomTheme>()

  const onClickHandler = (e:  React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    console.log('onClickHandler')
  }

  return (
    <>
      <ListItemWrapper >
        <ListItem alignItems="center" onClick={onClickHandler}>
          {/*<ListItemAvatar>*/}
          {/*  <Avatar*/}
          {/*    sx={{*/}
          {/*      color: theme.palette.background.paper,*/}
          {/*      backgroundColor: theme.palette.primary.main,*/}
          {/*      border: 'none',*/}
          {/*      borderColor: theme.palette.primary.main*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <IconMailbox stroke={1.5} size="1.3rem" />*/}
          {/*  </Avatar>*/}
          {/*</ListItemAvatar>*/}
          <ListItemText primary={<Typography variant="subtitle1">{region.name}</Typography>} />
          <ListItemSecondaryAction>
            <Grid container justifyContent="flex-end">
              <Grid item>
              </Grid>
            </Grid>
          </ListItemSecondaryAction>
        </ListItem>
        {/*<Grid container direction="column" className="list-container">*/}
        {/*  <Grid item xs={12} sx={{ pb: 2 }}>*/}
        {/*    <Typography variant="subtitle2">{region.name}</Typography>*/}
        {/*  </Grid>*/}
        {/*  <Grid item xs={12}>*/}
        {/*    <Grid container>*/}
        {/*      <Grid item>*/}
        {/*      </Grid>*/}
        {/*    </Grid>*/}
        {/*  </Grid>*/}
        {/*</Grid>*/}
      </ListItemWrapper>
    </>
  )
}
