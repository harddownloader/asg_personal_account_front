// @ts-nocheck
// import PropTypes from 'prop-types'
import { forwardRef, useEffect } from 'react'
import Link from 'next/link'

// mui
import { useTheme } from '@mui/material/styles'
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material'

// store
import menu from '@/stores/menuStore'

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { fixMeInTheFuture } from "@/lib/types"

// NavItem.propTypes = {
//   item: PropTypes.object,
//   level: PropTypes.number
// }

export const NavItem = ({ item, level }: fixMeInTheFuture) => {
  const theme = useTheme()
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'))

  const Icon = item.icon
  const itemIcon = item?.icon ? (
    <Icon stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: menu.menu.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
        height: menu.menu.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  )

  let itemTarget = '_self'
  if (item.target) {
    itemTarget = '_blank'
  }

  let listItemProps = {
    component: forwardRef((props, ref) => (
      <Link href={item.url} passHref legacyBehavior>
        <a
          ref={ref}
          {...props}
          href={item.url}
          target={itemTarget}
        ></a>
      </Link>))
  }
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget }
  }

  const itemHandler = (id) => {
    // dispatch({ type: MENU_OPEN, id })
    menu.setOpenMenuItem(id)
    // if (matchesSM) dispatch({ type: SET_MENU, opened: false })
    if (matchesSM) menu.toggleMenuStatus(false)
  }

  // active menu item on page load
  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id)
    if (currentIndex > -1) {
      // dispatch({ type: MENU_OPEN, id: item.id })
      menu.setOpenMenuItem(id)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `4px`,
        mb: 0.5,
        alignItems: 'flex-start',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`
      }}
      selected={menu.menu.isOpen.findIndex((id) => id === item.id) > -1}
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon
        sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}
      >{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant={menu.menu.isOpen.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'}
            color="inherit"
          >
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography
              variant="caption"
              sx={{ ...theme.typography.subMenuCaption }}
              display="block"
              gutterBottom
            >
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  )
}

export default NavItem
