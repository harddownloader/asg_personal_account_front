import { TRegionName } from "@/entities/Region/types/regions"

export const FIRST_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_FIRST_REGION_SHORTNAME || "" as const
export const SECOND_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_SECOND_REGION_SHORTNAME || "" as const
export const THIRD_REGION_SHORTNAME: string = process.env.NEXT_PUBLIC_THIRD_REGION_SHORTNAME || "" as const
export const REGIONS: TRegionName[] = [
  FIRST_REGION_SHORTNAME,
  SECOND_REGION_SHORTNAME,
  THIRD_REGION_SHORTNAME
] as const;

export const DEFAULT_REGION = THIRD_REGION_SHORTNAME
