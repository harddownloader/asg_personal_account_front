import { SORTING_BY_DATE } from "@/entities/Cargo"

export type TByDate = typeof SORTING_BY_DATE.ASC | typeof SORTING_BY_DATE.DESC

export type TIsShowFilters = boolean

export interface IFiltersOfList {
  isShowFilters: TIsShowFilters
  byDate: TByDate
}
