import { forwardRef, useEffect } from 'react'
import Link from 'next/link'
import { observer } from "mobx-react-lite"

// mui
import { useTheme } from '@mui/material/styles'
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery
} from '@mui/material'

// store
import MenuStore from '@/stores/menuStore'

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { fixMeInTheFuture } from "@/lib/types"

export interface NavItemProps {
  item: fixMeInTheFuture
  level: number
}

const NavItemComponent = ({ item, level }: NavItemProps) => {
  const theme = useTheme()
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'))

  const Icon = item.icon
  const itemIcon = item?.icon ? (
    <Icon stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: MenuStore.menu.openedIds.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
        height: MenuStore.menu.openedIds.findIndex((id) => id === item?.id) > -1 ? 8 : 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  )

  let itemTarget = '_self'
  if (item.target) {
    itemTarget = '_blank'
  }

  const ListItemNextJSLinkComponent = forwardRef((props, ref) => (
    <Link href={item.url} passHref legacyBehavior>
      <a
        // @ts-ignore
        ref={ref}
        {...props}
        href={item.url}
        target={itemTarget}
      ></a>
    </Link>))

  ListItemNextJSLinkComponent.displayName = 'ListItemNextJSLinkComponent'
  let listItemProps = {
    component: ListItemNextJSLinkComponent
  }

  if (item?.external) {
    // @ts-ignore
    listItemProps = { component: 'a', href: item.url, target: itemTarget }
  }

  const itemHandler = (id: string) => {
    MenuStore.setOpenMenuItem(id)
    if (matchesSM) MenuStore.toggleMenuStatus(false)
  }

  // active menu item on page load
  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id)
    if (currentIndex > -1) {
      MenuStore.setOpenMenuItem(item.id)
    }
  }, [])

  return (
    <>
      <ListItemButton
        {...listItemProps}
        disabled={item.disabled}
        sx={{
          borderRadius: `4px`,
          mb: 0.5,
          alignItems: 'flex-start',
          color: level > 1 ? `${theme.palette.primary.main} !important` : 'inherit',
          backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`
        }}
        selected={MenuStore.menu.openedIds.findIndex((id) => id === item.id) > -1}
        onClick={() => itemHandler(item.id)}
      >
        <ListItemIcon
          sx={{
            my: 'auto',
            minWidth: !item?.icon ? 18 : 36,
            color: level > 1 ? `${theme.palette.primary.main} !important` : 'inherit'
          }}
        >{itemIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant={MenuStore.menu.openedIds.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'}
              color="inherit"
            >
              {item.title}
            </Typography>
          }
          secondary={
            item.caption && (
              <Typography
                variant="caption"
                // @ts-ignore
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
    </>
  )
}

export const NavItem = observer(NavItemComponent)

export default NavItem
