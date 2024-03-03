import { memo } from "react"

// mui
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase, Tooltip } from '@mui/material'

// project components
import { SearchSection } from './SearchSection'
import { ProfileSection } from './ProfileSection'
import { NotificationSection } from './NotificationSection'

// entities
import { RegionSection } from "@/entities/Region"

// widgets
import { LogoSection } from "@/widgets/LogoSection"

// assets
import { IconMenu2 } from '@tabler/icons-react'

// shared
import { ICustomTheme } from "@/shared/lib/themes/theme"

export interface IHeaderProps {
  handleLeftDrawerToggle: () => void
}

export const Header = memo(({ handleLeftDrawerToggle }: IHeaderProps) => {
  const theme = useTheme<ICustomTheme>()

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
                ...theme.typography.commonAvatar,
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

      {/*<RegionSection />*/}
      <NotificationSection />
      <ProfileSection />
    </>
  )
})

Header.displayName = 'Header'
