import { useEffect } from "react"

export const useDetectUserLocation = <T extends Function, Q extends Function>(successCallback: T, failCallback: Q) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch("https://ipapi.co/json")
        .then(res => res.json())
        .then(userIpRes => {
          // console.log({
          //   [`${COUNTRY_FIELD_NAME}`]: userIpRes.country_code,
          //   timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          // })

          // resetForm({
          //   [`${COUNTRY_FIELD_NAME}`]: userIpRes.country_code
          // })
          successCallback && successCallback(userIpRes.country_code)
        })
        .catch((e) => {
          console.error("Fetching Error: fetch for getting info about users country is down", {e})
          failCallback && failCallback()
        })
    }
  }, [])

  return
}
