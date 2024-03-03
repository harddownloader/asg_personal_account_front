import { ReactElement } from "react"
import dashboard from './dashboard'
import pages from './pages'
import utilities from './utilities'
import other from './other'

// ==============================|| MENU ITEMS ||============================== //

export interface MenuItemInterface {
  id: string,
  title?: string
  type: string
  children?: Array<MenuItemInterface>
  url?: string
  breadcrumbs?: boolean
  icon?: ReactElement
  caption?: string
}

export interface MenuItemsInterface {
  items: Array<MenuItemInterface>
}

export const menuItems = {
  items: [
    // dashboard,
    pages,
    // utilities,
    // other
  ]
}
