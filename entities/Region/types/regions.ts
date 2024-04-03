import { FirebaseOptions } from "firebase/app"

export type TRegionName = string
export type TRegionLoading = boolean

export interface IRegion {
  name: TRegionName
}

export interface IRegionFull extends IRegion {
  config: FirebaseOptions
}

export interface IRegionStore {
  items: IRegion[]
  currentItem: null | IRegion
  isLoading: TRegionLoading
}
