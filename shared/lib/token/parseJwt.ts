import { TDecodedAccessToken } from "@/entities/User"

/*
* return jwt token decoded values.
* JWT uses base64url (RFC 4648 §5), so using only atob (which uses base64) isn't enough.
* */
export const parseJwtOnBrowser = (token: string): TDecodedAccessToken => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export const parseJwtOnServer = (token: string): TDecodedAccessToken => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
