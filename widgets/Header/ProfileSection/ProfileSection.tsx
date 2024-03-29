// @ts-nocheck
import { useState, useRef, useEffect, memo } from 'react'
import { useRouter } from "next/navigation"

// mui
import { useTheme } from '@mui/material/styles'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography
} from '@mui/material'

// project components
import {MainCard} from '@/shared/ui/cards/MainCard'
import {Transitions} from '@/shared/ui/extended/Transitions'
import UpgradePlanCard from './UpgradePlanCard'

// shared
import { pagesPath } from "@/shared/lib/$path"
import { ICustomTheme } from '@/shared/lib/themes/theme'

// store
import { UserStore } from "@/entities/User"

// assets
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react'
import User1 from '/public/img/users/user-round.svg'

// ==============================|| PROFILE MENU ||============================== //

export const ProfileSection = memo(() => {
  const theme = useTheme<ICustomTheme>()
  const router = useRouter()

  const [sdm, setSdm] = useState(true)
  const [value, setValue] = useState('')
  const [notification, setNotification] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null)
  const handleLogout = async () => {
    const logoutReq = await UserStore.logout()
    if (logoutReq) await router.push(pagesPath.login.$url().pathname)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setIsOpen(false)
  }

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index)
    handleClose(event)

    if (route && route !== '') {
      // navigate(route)
      router.push(route)
    }
  }
  const handleToggle = () => {
    setIsOpen((prevOpen) => !prevOpen)
  }

  const prevOpen = useRef(isOpen)
  useEffect(() => {
    if (prevOpen.current === true && isOpen === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = isOpen
  }, [isOpen])

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.common.white,
          backgroundColor: theme.palette.common.white,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.common.white,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.common.white,
            '& svg': {
              stroke: theme.palette.common.white
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={User1.src}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer',
              color: theme.palette.common.white,
              background: theme.palette.primary.main,
              '&:hover': {
                background: theme.palette.common.white, // theme.palette.secondary.dark,
                color: theme.palette.primary.main, // theme.palette.secondary.light
                border: `1px ${theme.palette.common.white} solid`,
              }
            }}
            ref={anchorRef}
            aria-controls={isOpen ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={isOpen ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
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
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={isOpen} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  {/*<Box sx={{ p: 2 }}>*/}
                  {/*    <Stack>*/}
                  {/*        <Stack direction="row" spacing={0.5} alignItems="center">*/}
                  {/*            <Typography variant="h4">Good Morning,</Typography>*/}
                  {/*            <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>*/}
                  {/*                Johne Doe*/}
                  {/*            </Typography>*/}
                  {/*        </Stack>*/}
                  {/*        <Typography variant="subtitle2">Project Admin</Typography>*/}
                  {/*    </Stack>*/}
                  {/*    <OutlinedInput*/}
                  {/*        sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}*/}
                  {/*        id="input-search-profile"*/}
                  {/*        value={value}*/}
                  {/*        onChange={(e) => setValue(e.target.value)}*/}
                  {/*        placeholder="Search profile options"*/}
                  {/*        startAdornment={*/}
                  {/*            <InputAdornment position="start">*/}
                  {/*                <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />*/}
                  {/*            </InputAdornment>*/}
                  {/*        }*/}
                  {/*        aria-describedby="search-helper-text"*/}
                  {/*        inputProps={{*/}
                  {/*            'aria-label': 'weight'*/}
                  {/*        }}*/}
                  {/*    />*/}
                  {/*    <Divider />*/}
                  {/*</Box>*/}
                  {/*<PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>*/}
                  <div style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2 }}>
                      {/*<UpgradePlanCard />*/}
                      {/*<Divider />*/}
                      {/*<Card*/}
                      {/*    sx={{*/}
                      {/*        bgcolor: theme.palette.primary.light,*/}
                      {/*        my: 2*/}
                      {/*    }}*/}
                      {/*>*/}
                      {/*    <CardContent>*/}
                      {/*        <Grid container spacing={3} direction="column">*/}
                      {/*            <Grid item>*/}
                      {/*                <Grid item container alignItems="center" justifyContent="space-between">*/}
                      {/*                    <Grid item>*/}
                      {/*                        <Typography variant="subtitle1">Start DND Mode</Typography>*/}
                      {/*                    </Grid>*/}
                      {/*                    <Grid item>*/}
                      {/*                        <Switch*/}
                      {/*                            color="primary"*/}
                      {/*                            checked={sdm}*/}
                      {/*                            onChange={(e) => setSdm(e.target.checked)}*/}
                      {/*                            name="sdm"*/}
                      {/*                            size="small"*/}
                      {/*                        />*/}
                      {/*                    </Grid>*/}
                      {/*                </Grid>*/}
                      {/*            </Grid>*/}
                      {/*            <Grid item>*/}
                      {/*                <Grid item container alignItems="center" justifyContent="space-between">*/}
                      {/*                    <Grid item>*/}
                      {/*                        <Typography variant="subtitle1">Allow Notifications</Typography>*/}
                      {/*                    </Grid>*/}
                      {/*                    <Grid item>*/}
                      {/*                        <Switch*/}
                      {/*                            checked={notification}*/}
                      {/*                            onChange={(e) => setNotification(e.target.checked)}*/}
                      {/*                            name="sdm"*/}
                      {/*                            size="small"*/}
                      {/*                        />*/}
                      {/*                    </Grid>*/}
                      {/*                </Grid>*/}
                      {/*            </Grid>*/}
                      {/*        </Grid>*/}
                      {/*    </CardContent>*/}
                      {/*</Card>*/}
                      {/*<Divider />*/}
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        {/*<ListItemButton*/}
                        {/*    sx={{ borderRadius: `4px` }}*/}
                        {/*    selected={selectedIndex === 0}*/}
                        {/*    onClick={(event) => handleListItemClick(event, 0, '/users/account-profile/profile1')}*/}
                        {/*>*/}
                        {/*    <ListItemIcon>*/}
                        {/*        <IconSettings stroke={1.5} size="1.3rem" />*/}
                        {/*    </ListItemIcon>*/}
                        {/*    <ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />*/}
                        {/*</ListItemButton>*/}
                        {/*<ListItemButton*/}
                        {/*    sx={{ borderRadius: `4px` }}*/}
                        {/*    selected={selectedIndex === 1}*/}
                        {/*    onClick={(event) => handleListItemClick(event, 1, '/users/social-profile/posts')}*/}
                        {/*>*/}
                        {/*    <ListItemIcon>*/}
                        {/*        <IconUser stroke={1.5} size="1.3rem" />*/}
                        {/*    </ListItemIcon>*/}
                        {/*    <ListItemText*/}
                        {/*        primary={*/}
                        {/*            <Grid container spacing={1} justifyContent="space-between">*/}
                        {/*                <Grid item>*/}
                        {/*                    <Typography variant="body2">Social Profile</Typography>*/}
                        {/*                </Grid>*/}
                        {/*                <Grid item>*/}
                        {/*                    <Chip*/}
                        {/*                        label="02"*/}
                        {/*                        size="small"*/}
                        {/*                        sx={{*/}
                        {/*                            bgcolor: theme.palette.warning.dark,*/}
                        {/*                            color: theme.palette.background.default*/}
                        {/*                        }}*/}
                        {/*                    />*/}
                        {/*                </Grid>*/}
                        {/*            </Grid>*/}
                        {/*        }*/}
                        {/*    />*/}
                        {/*</ListItemButton>*/}
                        <ListItemButton
                          sx={{ borderRadius: `4px` }}
                          selected={selectedIndex === 4}
                          onClick={() => handleLogout()}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography
                            variant="body2"
                            className={"text-inherit"}
                          >Выйти</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                    {/*</PerfectScrollbar>*/}
                  </div>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  )
})

ProfileSection.displayName = ProfileSection
