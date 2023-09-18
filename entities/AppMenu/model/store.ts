import { makeAutoObservable } from 'mobx'
import type {
  IMenuState
} from '@/entities/AppMenu'

export class _MenuStore {
  menu: IMenuState = {
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

