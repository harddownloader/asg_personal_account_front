import { useEffect } from "react"

export const useDetectUserLocation = <T extends Function, Q extends Function>(successCallback: T, failCallback: Q) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch("https://ipapi.co/json")
        .then(res => res.json())
        .then(userIpRes => {
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
