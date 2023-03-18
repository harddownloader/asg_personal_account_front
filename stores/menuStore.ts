import { makeAutoObservable } from 'mobx'

export type openedType = boolean

export interface MenuState {
  opened: openedType
  isOpen: Array<string>
}

class MenuStore {
  menu: MenuState = {
    opened: false,
    isOpen: [], // for active default menu
  }

  constructor() {
    makeAutoObservable(this)
  }

  toggleMenuStatus = (opened: boolean) => {
    this.menu.opened = opened
  }

  setOpenMenuItem = (id: string) => {
    this.menu.isOpen = [id]
  }
}

export default new MenuStore()
