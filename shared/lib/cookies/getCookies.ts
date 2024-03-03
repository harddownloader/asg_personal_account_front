/*
* get cookies on frontend side
* return cookie by name,
* or undefined, if it not exists
* */
export function getCookies(name: string): string | undefined {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
