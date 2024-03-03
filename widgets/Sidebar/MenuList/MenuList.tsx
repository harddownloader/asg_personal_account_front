import { memo } from "react"

// mui
import { Typography } from '@mui/material'

// project components
import { NavGroup } from './NavGroup'
import { menuItems } from '@/shared/lib/menu'

import { IconDashboard } from '@tabler/icons-react'

export const MenuList = memo(() => {
  const navItems = menuItems.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        )
    }
  })

  return <>{navItems}</>
})

MenuList.displayName = 'MenuList'
