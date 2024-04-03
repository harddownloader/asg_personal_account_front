import { IRegionFull, TRegionName } from "@/entities/Region/types/regions"
import {
  firstFirebaseClientConfig,
  secondFirebaseClientConfig,
  thirdFirebaseClientConfig,
  fourthFirebaseClientConfig,
  fifthFirebaseClientConfig,
} from "@/entities/Region/lib/firebase/firebaseClientConfigs"

export const FIRST_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_FIRST_REGION_SHORTNAME || "" as const
export const SECOND_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_SECOND_REGION_SHORTNAME || "" as const
export const THIRD_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_THIRD_REGION_SHORTNAME || "" as const

export const FOURTH_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_FOURTH_REGION_SHORTNAME || "" as const
export const FIFTH_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_FIFTH_REGION_SHORTNAME || "" as const

export const REGIONS_FULL: IRegionFull[] = [
  {
    name: FIRST_REGION_SHORTNAME,
    config: firstFirebaseClientConfig,
  },
  {
    name: SECOND_REGION_SHORTNAME,
    config: secondFirebaseClientConfig,
  },
  {
    name: THIRD_REGION_SHORTNAME,
    config: thirdFirebaseClientConfig,
  },
  {
    name: FOURTH_REGION_SHORTNAME,
    config: fourthFirebaseClientConfig,
  },
  {
    name: FIFTH_REGION_SHORTNAME,
    config: fifthFirebaseClientConfig,
  },
]

export const REGIONS_NAMES: TRegionName[] = REGIONS_FULL.map(region => region.name)

export const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION_SHORTNAME || "" as const
