'use client'

import { DEFAULT_REGION, REGIONS_FULL, REGIONS_NAMES } from "./list"
import { REGION_KEY } from "./cookies"

export const getRegionClientConfig = () => ({
  default: DEFAULT_REGION,
  list: REGIONS_FULL,
  namesList: REGIONS_NAMES,
  cookiesKeys: {
    current: REGION_KEY
  }
})
