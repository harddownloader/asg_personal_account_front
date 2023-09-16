export const WEBSITE_NAME = process.env.NEXT_PUBLIC_WEBSITE_NAME || ""
export const API_URI = process.env.NEXT_PUBLIC_API_URI || ""
export const BASE_NAME = '' // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead, like '/shop/dashboard'
export const DEFAULT_PATH = '/' // if we want to show users a different default layout
export const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || ""
export const SOCKET_SERVER_PATH = process.env.NEXT_PUBLIC_SOCKET_SERVER_PATH || ""
