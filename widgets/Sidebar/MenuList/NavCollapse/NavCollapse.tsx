// import PropTypes from 'prop-types'
import { useState } from 'react'

// mui
import { useTheme } from '@mui/material/styles'
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'

// project components
import { NavItem } from '../NavItem'

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import {TFixMeInTheFuture} from "@/shared/types/types"
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'

// shared
import { ICustomTheme } from '@/shared/lib/themes/theme'

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //
export interface INavCollapseProps {
  menu: TFixMeInTheFuture
  level: number
}

export const NavCollapse = ({ menu, level }: INavCollapseProps) => {
  const theme = useTheme<ICustomTheme>()

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const handleClick = () => {
    setIsOpen(!isOpen)
    setSelected(!selected ? menu.id : null)
  }

  // menu collapse & item
  const menus = menu.children?.map((item: TFixMeInTheFuture) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        )
    }
  })

  const Icon = menu.icon
  const menuIcon = menu.icon ? (
    <Icon strokeWidth={1.5} size="1.3rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: selected === menu.id ? 8 : 6,
        height: selected === menu.id ? 8 : 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  )

  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: `4px`,
          mb: 0.5,
          alignItems: 'flex-start',
          backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>{menuIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography variant={selected === menu.id ? 'h5' : 'body1'} color="inherit" sx={{ my: 'auto' }}>
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography variant="caption" sx={
                // @ts-ignore
                { ...theme.typography.subMenuCaption }
              } display="block" gutterBottom>
                {menu.caption}
              </Typography>
            )
          }
        />
        {isOpen ? (
          <IconChevronUp stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
        ) : (
          <IconChevronDown stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
        )}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            position: 'relative',
            '&:after': {
              content: "''",
              position: 'absolute',
              left: '32px',
              top: 0,
              height: '100%',
              width: '1px',
              opacity: 1,
              background: theme.palette.primary.main
            }
          }}
        >
          {menus}
        </List>
      </Collapse>
    </>
  )
}

// NavCollapse.propTypes = {
//   menu: PropTypes.object,
//   level: PropTypes.number
// }

export default NavCollapse
