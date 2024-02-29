import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import type {
  IMenuState
} from '@/entities/AppMenu'
import { PAGES_IDS } from '@/shared/lib/menu/pages'

export class _MenuStore {
  menu: IMenuState = {
    opened: true,
    openedIds: [PAGES_IDS.CARGOS] // for active default menu
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

