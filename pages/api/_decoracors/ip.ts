import { createParamDecorator } from 'next-api-decorators'

export const Ip = createParamDecorator<string | undefined>(
  (req) => {
    const forwarded = req.headers["x-forwarded-for"]
    const ip = (forwarded && typeof forwarded === "string" )
      ? forwarded.split(/, /)[0]
      : req.connection.remoteAddress

    return ip
  }
)
