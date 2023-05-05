import React from "react"

// mui
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase, Tooltip } from '@mui/material'

// project components
import { SearchSection } from './SearchSection'
import { ProfileSection } from './ProfileSection'
import { NotificationSection } from './NotificationSection'

// assets
import { IconMenu2 } from '@tabler/icons-react'
import { LogoSection } from "@/components/LogoSection"

export interface HeaderProps {
  handleLeftDrawerToggle: () => void
}

export const Header = ({ handleLeftDrawerToggle }: HeaderProps) => {
  const theme = useTheme()

  return (
    <>
      {/* logo & toggle button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <Tooltip title={'Меню'}>
          <ButtonBase sx={{ overflow: 'hidden' }}>
            <Avatar
              variant="rounded"
              sx={{
                // @ts-ignore
                ...theme.typography.commonAvatar,
                // @ts-ignore
                ...theme.typography.mediumAvatar,
                borderRadius: '4px',
                transition: 'all .2s ease-in-out',
                background: theme.palette.common.white,
                color: theme.palette.primary.main,
                '&:hover': {
                  background: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  border: `1px ${theme.palette.common.white} solid`,
                }
              }}
              onClick={handleLeftDrawerToggle}
              color="inherit"
            >
              <IconMenu2 stroke={1.5} size="1.3rem" />
            </Avatar>
          </ButtonBase>
        </Tooltip>
      </Box>

      {/*/!* header search *!/*/}
      {/*<SearchSection />*/}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      <NotificationSection />
      <ProfileSection />
    </>
  )
}

export default Header
