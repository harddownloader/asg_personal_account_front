import { makeAutoObservable } from 'mobx'

export type openedType = boolean

export interface MenuState {
  opened: openedType
  openedIds: Array<string>
}

class MenuStore {
  menu: MenuState = {
    opened: true,
    openedIds: [], // for active default menu
  }

  constructor() {
    makeAutoObservable(this)
  }

  toggleMenuStatus = (opened: boolean) => {
    this.menu.opened = opened
  }

  setOpenMenuItem = (id: string) => {
    this.menu.openedIds = [id]
  }
}

export default new MenuStore()
