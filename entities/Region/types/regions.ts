
export type TRegionName = string

export interface IRegion {
  name: TRegionName
}

export interface IRegionStore {
  items: IRegion[]
  currentItem: null | IRegion
}
