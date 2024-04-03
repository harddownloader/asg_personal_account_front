import { Fragment } from "react"
import { observer } from "mobx-react-lite"

// mui
import { useTheme, styled } from '@mui/material/styles'
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Typography
} from '@mui/material'

// project components
import { NotificationItem } from './NotificationItem'


// entities
import type { INotification } from '@/entities/Notification'

// shared
import { ICustomTheme } from '@/shared/lib/themes/theme'

export interface NotificationListProps {
  notifications: Array<INotification>
}

export const NotificationList = observer(({ notifications }: NotificationListProps) => {
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
            (Array.isArray(notifications) && notifications.length)
             ? notifications.map((notification, index) => (
                <Fragment key={index}>
                  <NotificationItem
                    id={notification.id}
                    title={notification.title}
                    message={notification.content}
                    isViewed={notification.isViewed}
                  />
                </Fragment>
              ))
              : <p className={"p-8 text-xs"}>Нет уведомлений</p>
          }
        </List>
    )
})

NotificationList.displayName = 'NotificationList'
