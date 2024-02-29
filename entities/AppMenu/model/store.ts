import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
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

    // makePersistable(this, {
    //   name: 'MenuStore',
    //   storage: typeof window !== "undefined" ? window.localStorage : undefined,
    //   properties: [
    //     'menu'
    //   ]
    // })
  }

  toggleMenuStatus = (opened: boolean) => {
    this.menu.opened = opened
  }

  setOpenMenuItem = (id: string) => {
    this.menu.openedIds = [id]
  }
}

