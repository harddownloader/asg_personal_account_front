import Image from "next/image"
import React from "react"

declare type SafeNumber = number | `${number}`

export type TGetCountryFlagImageArgs = {
  countryShortname: string
  width: SafeNumber
  height: SafeNumber
}

export const getCountryFlagImage = ({
                                      countryShortname,
                                      width,
                                      height
                                    }: TGetCountryFlagImageArgs) => {
  return (
    <>
      <Image
        width={width}
        height={height}
        alt={'flag'}
        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryShortname.toUpperCase()}.svg`}
      />
    </>
  )
}
