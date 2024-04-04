import { IRegionFull, TRegionName } from "@/entities/Region/types/regions"

export const FIRST_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_FIRST_REGION_SHORTNAME || "" as const
export const SECOND_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_SECOND_REGION_SHORTNAME || "" as const
export const THIRD_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_THIRD_REGION_SHORTNAME || "" as const

export const FOURTH_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_FOURTH_REGION_SHORTNAME || "" as const
export const FIFTH_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_FIFTH_REGION_SHORTNAME || "" as const

export const SIXTH_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_SIXTH_REGION_SHORTNAME || ""

export const REGIONS_FULL: IRegionFull[] = [
  {
    name: FIRST_REGION_SHORTNAME,
    config: JSON.parse(
      process.env.NEXT_PUBLIC_FIRST_FIREBASE_CLIENT as string
    ),
  },
  {
    name: SECOND_REGION_SHORTNAME,
    config: JSON.parse(
      process.env.NEXT_PUBLIC_SECOND_FIREBASE_CLIENT as string
    ),
  },
  {
    name: THIRD_REGION_SHORTNAME,
    config: JSON.parse(
      process.env.NEXT_PUBLIC_THIRD_FIREBASE_CLIENT as string
    ),
  },
  {
    name: FOURTH_REGION_SHORTNAME,
    config: JSON.parse(
      process.env.NEXT_PUBLIC_FOURTH_FIREBASE_CLIENT as string
    ),
  },
  {
    name: FIFTH_REGION_SHORTNAME,
    config: JSON.parse(
      process.env.NEXT_PUBLIC_FIFTH_FIREBASE_CLIENT as string
    ),
  },
  {
    name: SIXTH_REGION_SHORTNAME,
    config: JSON.parse(
      process.env.NEXT_PUBLIC_SIXTH_FIREBASE_CLIENT as string
    )
  }
]

export const REGIONS_NAMES: TRegionName[] = REGIONS_FULL.map(region => region.name)

export const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION_SHORTNAME || "" as const
