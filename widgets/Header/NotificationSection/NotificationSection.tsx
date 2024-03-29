// @ts-nocheck
import { useState, useRef, useEffect, useMemo, memo } from 'react'

// mui
import { useTheme } from '@mui/material/styles'
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardActions,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField, Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material'

// third-party
// import PerfectScrollbar from 'react-perfect-scrollbar'

// project components
import {MainCard} from '@/shared/ui/cards/MainCard'
import {Transitions} from '@/shared/ui/extended/Transitions'
import NotificationList from './NotificationList'
import { StyledBadge } from '@/shared/ui/StyledBadge'

// assets
import classes from './NotificationSection.module.scss'
import { IconBell } from '@tabler/icons-react'

// store
import { NotificationsStore } from "@/entities/Notification"
import { observer } from "mobx-react-lite"

// shared
import { ICustomTheme } from '@/shared/lib/themes/theme'

// notification status options
const status = [
  {
    value: 'all',
    label: 'All Notification'
  },
  {
    value: 'new',
    label: 'New'
  },
  {
    value: 'unread',
    label: 'Unread'
  },
  {
    value: 'other',
    label: 'Other'
  }
]

// ==============================|| NOTIFICATION ||============================== //

export const NotificationSection = observer(() => {
  const theme = useTheme<ICustomTheme>()
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'))

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [value, setValue] = useState('')
  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null)

  const handleToggle = () => {
    setIsOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setIsOpen(false)
  }

  const prevOpen = useRef(isOpen)
  useEffect(() => {
    if (prevOpen.current === true && isOpen === false) {
      anchorRef.current.focus()
    }
    prevOpen.current = isOpen
  }, [isOpen])

  const handleChange = (event) => {
    if (event?.target.value) setValue(event?.target.value)
  }

  // notification list
  const notificationsItemsStr = JSON.stringify(NotificationsStore.notifications.items)
  const notifications = useMemo(
    () => JSON.parse(notificationsItemsStr),
    [notificationsItemsStr]
  )
  const AreThereAnyUnreadNotifications = notifications.some((notification) => notification.isViewed === false)

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <Tooltip title={'Уведомления'}>
          <ButtonBase>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              invisible={!AreThereAnyUnreadNotifications}
            >
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  borderRadius: '4px',
                  transition: 'all .2s ease-in-out',
                  background: theme.palette.common.white,
                  color: theme.palette.primary.main,
                  '&[aria-controls="menu-list-grow"],&:hover': {
                    background: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    border: `1px ${theme.palette.common.white} solid`,
                  }
                }}
                ref={anchorRef}
                aria-controls={isOpen ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="inherit"
              >
                <IconBell stroke={1.5} size="1.3rem" />
              </Avatar>
            </StyledBadge>
          </ButtonBase>
        </Tooltip>
      </Box>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={isOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 5 : 0, 20]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions position={matchesXs ? 'top' : 'top-right'} in={isOpen} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                        <Grid item>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">Все уведомления</Typography>
                            {/*<Chip*/}
                            {/*  size="small"*/}
                            {/*  label="01"*/}
                            {/*  sx={{*/}
                            {/*    color: theme.palette.background.default,*/}
                            {/*    bgcolor: theme.palette.warning.dark*/}
                            {/*  }}*/}
                            {/*/>*/}
                          </Stack>
                        </Grid>
                        <Grid item>
                          {/*<Typography component={Link} href="#" variant="subtitle2" color="primary">*/}
                          {/*  Mark as all read*/}
                          {/*</Typography>*/}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      {/*<PerfectScrollbar*/}
                      {/*    style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}*/}
                      {/*>*/}
                      <div className={classes.notifications_list__wrap}>
                        {/*<Grid container direction="column" spacing={2}>*/}
                        {/*  <Grid item xs={12}>*/}
                        {/*    <Box sx={{ px: 2, pt: 0.25 }}>*/}
                        {/*      <TextField*/}
                        {/*        id="outlined-select-currency-native"*/}
                        {/*        select*/}
                        {/*        fullWidth*/}
                        {/*        value={value}*/}
                        {/*        onChange={handleChange}*/}
                        {/*        SelectProps={{*/}
                        {/*          native: true*/}
                        {/*        }}*/}
                        {/*      >*/}
                        {/*        {status.map((option) => (*/}
                        {/*          <option key={option.value} value={option.value}>*/}
                        {/*            {option.label}*/}
                        {/*          </option>*/}
                        {/*        ))}*/}
                        {/*      </TextField>*/}
                        {/*    </Box>*/}
                        {/*  </Grid>*/}
                        {/*  <Grid item xs={12} p={0}>*/}
                        {/*    <Divider sx={{ my: 0 }} />*/}
                        {/*  </Grid>*/}
                        {/*</Grid>*/}
                        <NotificationList notifications={notifications} />
                        {/*</PerfectScrollbar>*/}
                      </div>
                    </Grid>
                  </Grid>
                  {/*<Divider />*/}
                  {/*<CardActions sx={{ p: 1.25, justifyContent: 'center' }}>*/}
                  {/*  <Button size="small" disableElevation>*/}
                  {/*    View All*/}
                  {/*  </Button>*/}
                  {/*</CardActions>*/}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  )
})
