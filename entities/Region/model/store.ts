import { makeAutoObservable } from "mobx"
import * as Sentry from "@sentry/nextjs"
import { IRegion, IRegionStore } from "@/entities/Region/types/regions"
import { REGIONS } from "./../const"


export class _RegionsStore {
  regions: IRegionStore = {
    items: [...REGIONS.map(region => ({
      name: region
    }))],
    currentItem: null
  }

  constructor() {
    makeAutoObservable(this)
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
}
