import { observer } from 'mobx-react-lite'

// mui
import { useTheme } from '@mui/material/styles'
import { Box, Drawer, useMediaQuery } from '@mui/material'

// project components
import { MenuList } from './MenuList'
import { LogoSection } from '@/widgets/LogoSection'
import { TonesSidebar } from "@/widgets/Sidebar/TonesSidebar"

// shared
import { DRAWER_WIDTH } from '@/shared/const'
import { ICustomTheme } from '@/shared/lib/themes/theme'
import { USER_ROLE, UserStore } from "@/entities/User"

export interface ISidebarProps {
  drawerOpen: boolean
  drawerToggle: () => void
}

export const Sidebar = observer(({
                                   drawerOpen,
                                   drawerToggle
}: ISidebarProps) => {
  const theme = useTheme<ICustomTheme>()
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))
  const currentUser = UserStore.user.currentUser
  const isUserEmployee = currentUser.role > USER_ROLE.CLIENT

  const drawer = (
    <>
      <div className="bg-brand">
        <Box sx={{display: {xs: 'block', md: 'none'}}}>
          <Box sx={{display: 'flex', p: 2, mx: 'auto'}}>
            <LogoSection/>
          </Box>
        </Box>
      </div>
      <MenuList/>
      {isUserEmployee && <TonesSidebar/>}
    </>
  )

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        width: matchUpMd ? DRAWER_WIDTH : 'auto'
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '88px'
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  )
})

Sidebar.displayName = 'Sidebar'
