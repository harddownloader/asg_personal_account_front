import { AUTHORIZATION_HEADER_KEY } from "@/shared/lib/providers/auth"

export type TFetchRequestArgs = Record<string, any>
/*
* fetch wrapper
*
* source: https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper
* */
export function fetchRequest(
  endpoint: string,
  { body, ...customConfig}: TFetchRequestArgs = {},
  token?: string,
  logoutCallback?: Function,
  ) {
  const headers: Record<string, any> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers[`${AUTHORIZATION_HEADER_KEY}`] = `Bearer ${token}`
  }
  const options: Record<string, any> = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: new Headers({
      ...headers,
      ...customConfig.headers,
    }),
  }

  if (body) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  return fetch(endpoint, options)
    .then(async response => {
      if (response.status === 401) {
        logoutCallback && logoutCallback()
        return
      }

      if (response.ok) {
        return await response.json()
      } else {
        try {
          const errorMessages = await response.json()
          console.log('fetchRequest', {errorMessages})
          // return Promise.reject(new Error(errorMessages))

          return Promise.reject(new Error(
            response.status === 400
              ? errorMessages.message
              : errorMessages
          ))
        } catch (e) {
          const errorMessage = await response.text()
          return Promise.reject(new Error(errorMessage))
        }
      }
    })
}
