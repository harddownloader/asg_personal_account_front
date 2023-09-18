// mui
import {
  Avatar,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"

// project components
import { StyledBadge } from "@/shared/ui/StyledBadge/StyledBadge"

// assets
import { IconMailbox } from "@tabler/icons-react"

// store
import { NotificationsStore } from "@/entities/Notification"
import { UserStore } from "@/entities/User"

// entities
import type {
  TNotificationId,
  TContentType,
  TNotificationStatus
} from '@/entities/Notification'

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
  id: TNotificationId
  title: string
  message: TContentType
  isViewed: TNotificationStatus
}

export const NotificationItem = ({
                                    id,
                                    title,
                                    message,
                                    isViewed,
                                 }: NotificationItem) => {
  const theme = useTheme()

  const toggleChangeStatus = async (unreadStatus: boolean) => {
    const country = UserStore.user.currentUser.country
    NotificationsStore.editStatus(id, country, unreadStatus)
  }

  const markNotificationAsViewed = () => {
    if (!isViewed) toggleChangeStatus(true)
  }

  return (
    <>
      <ListItemWrapper onMouseEnter={markNotificationAsViewed}>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              invisible={isViewed}
            >
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
            </StyledBadge>
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">{title}</Typography>} />
          <ListItemSecondaryAction>
            <Grid container justifyContent="flex-end">
              <Grid item>
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
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItemWrapper>
    </>
  )
}
