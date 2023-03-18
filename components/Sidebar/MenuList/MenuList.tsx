// mui
import { Typography } from '@mui/material'

// project components
import { NavGroup } from './NavGroup'
import { menuItems } from '@/lib/menu'

import { IconDashboard } from '@tabler/icons-react'

export const MenuList = () => {
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
}

export default MenuList
