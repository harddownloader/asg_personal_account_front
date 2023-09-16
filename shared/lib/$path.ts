
export const pagesPath = {
  "home": {
    $url: (url?: { hash?: string }) => ({ pathname: '/', query: '', hash: url?.hash })
  },
  "login": {
    $url: (url?: { hash?: string }) => ({ pathname: '/login', query: '', hash: url?.hash })
  },

  // profile
  "user_profile": {
    $url: (url?: { hash?: string }) => ({ pathname: '/user_profile', query: '', hash: url?.hash })
  },
  "profile": {
    $url: (url?: { hash?: string }) => ({ pathname: '/user_profile/profile', query: '', hash: url?.hash })
  },
  "security": {
    $url: (url?: { hash?: string }) => ({ pathname: '/user_profile/security', query: '', hash: url?.hash })
  },
}
