import { memo } from "react"

// mui
import { useTheme } from '@mui/material/styles'
import { Box, Drawer, useMediaQuery } from '@mui/material'

// project components
import { MenuList } from './MenuList'
import { LogoSection } from "@/widgets/LogoSection"

// shared
import { DRAWER_WIDTH } from '@/shared/const'

export interface SidebarProps {
  drawerOpen: boolean
  drawerToggle: () => void
}

export const Sidebar = ({ drawerOpen, drawerToggle }: SidebarProps) => {
  const theme = useTheme()
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

  const drawer = (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
          <LogoSection />
        </Box>
      </Box>
      <MenuList />
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
}

export default Sidebar
