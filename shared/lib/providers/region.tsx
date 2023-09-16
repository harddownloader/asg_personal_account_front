import { useState, useEffect, useContext, createContext } from "react"

// export const NONE_REGION_STATUS = 'none' as const;

const RegionContext = createContext<{ country: string | null }>({
  country: null
})

export type RegionProviderProps = {
  children: any
}

export function RegionProvider({ children }: RegionProviderProps) {
  const [country, setCountry] = useState<string | null>(null)

  return (
    <RegionContext.Provider value={{ country }}>
      { children }
    </RegionContext.Provider>
  )
}

export const useRegion = () => {
  return useContext(RegionContext)
}
