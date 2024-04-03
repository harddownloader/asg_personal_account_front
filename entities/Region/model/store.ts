import { makeAutoObservable } from "mobx"
import { makePersistable } from 'mobx-persist-store'
import * as Sentry from "@sentry/nextjs"
import { IRegion, IRegionStore, TRegionLoading } from "@/entities/Region/types/regions"
import { REGIONS_NAMES } from "./../const"


export class _RegionsStore {
  regions: IRegionStore = {
    items: [...REGIONS_NAMES.map(region => ({
      name: region
    }))],
    currentItem: null,
    isLoading: false
  }

  constructor() {
    makeAutoObservable(this)
    makePersistable(this, {
      name: 'RegionsStore',
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      properties: ['regions']
    })
  }

  setList = (list: Array<IRegion>) => {
    this.regions.items = [...list]
  }

  clearList = () => {
    this.regions.items = []
  }

  add = (region: IRegion) => {
    this.regions.items = [
      ...this.regions.items,
      region
    ]
  }

  setLoading = (status: TRegionLoading) => {
    this.regions.isLoading = status
  }

  setCurrentItem = (region: IRegion) => {
    this.regions.currentItem = region
  }
}
