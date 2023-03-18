// @ts-nocheck
import { observer } from "mobx-react-lite"

// mui
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"

// project components
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Breadcrumbs } from '@/components/ui-component/extended/Breadcrumbs'

// utils
import { menuItems } from '@/lib/menu'
import { DRAWER_WIDTH } from '@/lib/const'
import { fixMeInTheFuture } from "@/lib/types"

// store
import MenuStore, { openedType } from "@/stores/menuStore"

// assets
import { IconChevronRight } from '@tabler/icons-react'

export interface MainStyledComponentProps {
  theme: fixMeInTheFuture
  open: openedType
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
  children?: React.ReactNode
}

export const AccountLayout = observer(({ children }: AccountLayoutProps) => {
  const theme = useTheme()
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'))

  // Handle left drawer
  const isLeftDrawerOpened: openedType = MenuStore.menu.opened
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
            separator={IconChevronRight}
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

export default AccountLayout
