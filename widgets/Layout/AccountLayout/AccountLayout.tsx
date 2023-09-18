import { ReactNode, useCallback } from "react"
import { observer } from "mobx-react-lite"

// mui
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"

// project components
import { Header } from "@/widgets/Header"
import { Sidebar } from "@/widgets/Sidebar"
import { Breadcrumbs } from '@/shared/ui/extended/Breadcrumbs'

// shared
import { menuItems } from '@/shared/lib/menu'
import { DRAWER_WIDTH } from '@/shared/const'
import { TFixMeInTheFuture } from "@/shared/types/types"

// store
import { MenuStore, TOpened } from "@/entities/AppMenu"

// assets
import { IconChevronRight } from '@tabler/icons-react'

export interface MainStyledComponentProps {
  theme: TFixMeInTheFuture
  open: TOpened
}

// styles
const Main = styled(
  'main',
  { shouldForwardProp: (prop) => prop !== 'open' }
)(({ theme, open }: MainStyledComponentProps) => ({
  // ...theme.typography.mainContent,
  ...{
    backgroundColor: '#fff',
    width: '100%',
    minHeight: 'calc(100vh - 88px)',
    flexGrow: 1,
    padding: '20px',
    marginTop: '88px',
    marginRight: '20px',
    borderRadius: `${4}px`
  },
  ...(!open && {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.up('md')]: {
      marginLeft: -(DRAWER_WIDTH - 20),
      width: `calc(100% - ${DRAWER_WIDTH}px)`
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px',
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      padding: '16px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px',
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      padding: '16px',
      marginRight: '10px'
    }
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px'
    }
  })
}))

export interface AccountLayoutProps {
  children?: ReactNode
}

export const AccountLayout = observer(({ children }: AccountLayoutProps) => {
  const theme = useTheme()
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'))

  // Handle left drawer
  const isLeftDrawerOpened: TOpened = MenuStore.menu.opened
  const handleLeftDrawerToggle = () => {
    MenuStore.toggleMenuStatus(!isLeftDrawerOpened)
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* header */}
        <AppBar
          enableColorOnDark
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            bgcolor: theme.palette.primary.main,
            transition: isLeftDrawerOpened ? theme.transitions.create('width') : 'none'
          }}
        >
          <Toolbar>
            <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
          </Toolbar>
        </AppBar>

        {/* drawer */}
        <Sidebar
          drawerOpen={!matchDownMd ? isLeftDrawerOpened : !isLeftDrawerOpened}
          drawerToggle={handleLeftDrawerToggle}
        />

        {/* main content */}
        <Main theme={theme} open={isLeftDrawerOpened}>
          {/* breadcrumb */}
          <Breadcrumbs
            // @ts-ignore
            separator={IconChevronRight}
            // @ts-ignore
            navigation={menuItems}
            isIcon
            isTitle
            isRightAlign
          />
          {children}
        </Main>
      </Box>
    </>
  )
})
