// mui
import {
  Avatar,
  Button, Divider,
  Grid, List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@mui/material"
import {styled, useTheme} from "@mui/material/styles"

// assets
import {IconBrandTelegram, IconMailbox} from "@tabler/icons-react"

// store
import { contentType } from "@/stores/notificationsStore"

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: 16,
  '&:hover': {
    // background: theme.palette.primary.main,
    // color: theme.palette.background.paper,
  },
  '& .MuiListItem-root': {
    padding: 0
  }
}))

export interface NotificationItem {
  title: string,
  message: contentType
}

export const NotificationItem = ({
                                    title,
                                    message
                                 }: NotificationItem) => {
  const theme = useTheme()

  return (
    <>
      <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar
              sx={{
                color: theme.palette.background.paper,
                backgroundColor: theme.palette.primary.main,
                border: 'none',
                borderColor: theme.palette.primary.main
              }}
            >
              <IconMailbox stroke={1.5} size="1.3rem" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">{title}</Typography>} />
          <ListItemSecondaryAction>
            <Grid container justifyContent="flex-end">
              <Grid item>
                {/*<Typography variant="caption" display="block" gutterBottom>*/}
                {/*  2 min ago*/}
                {/*</Typography>*/}
              </Grid>
            </Grid>
          </ListItemSecondaryAction>
        </ListItem>
        <Grid container direction="column" className="list-container">
          <Grid item xs={12} sx={{ pb: 2 }}>
            <Typography variant="subtitle2">{message}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item>
                {/*<Button variant="contained" disableElevation endIcon={<IconBrandTelegram stroke={1.5} size="1.3rem" />}>*/}
                {/*  Mail*/}
                {/*</Button>*/}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItemWrapper>
    </>
  )
}

export default NotificationItem
