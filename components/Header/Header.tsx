// @ts-nocheck
import React from "react"

// mui
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase } from '@mui/material'

// project components
import { SearchSection } from './SearchSection'
import { ProfileSection } from './ProfileSection'
import { NotificationSection } from './NotificationSection'
import { fixMeInTheFuture } from "@/lib/types"

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
        <ButtonBase sx={{ overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              borderRadius: '4px',
              transition: 'all .2s ease-in-out',
              // border: `1px ${theme.palette.common.white} solid`,
              // background: theme.palette.primary.main,
              background: theme.palette.common.white, // theme.palette.secondary.light,
              // color: theme.palette.common.white, // theme.palette.secondary.dark,
              color: theme.palette.primary.main,
              '&:hover': {
                background: theme.palette.primary.main, // theme.palette.secondary.dark,
                color: theme.palette.common.white, // theme.palette.secondary.light
                border: `1px ${theme.palette.common.white} solid`,
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/*/!* header search *!/*/}
      {/*<SearchSection />*/}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/*/!* notification & profile *!/*/}
      <NotificationSection />
      <ProfileSection />
    </>
  )
}

export default Header
