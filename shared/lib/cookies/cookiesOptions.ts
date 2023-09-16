import * as cookie from "cookie"

export const cookiesOptions: {
  accessToken: cookie.CookieSerializeOptions
} = {
  accessToken: {
    path: '/',
    httpOnly: Boolean(process.env.NODE_ENV === "production"),
    secure: true,
    sameSite: 'strict',
  }
}
